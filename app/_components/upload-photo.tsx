/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef } from "react";
import { Upload, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { generateProfessionalPhoto } from "@/lib/api/analyze";


interface UploadPhotoProps {
    onImageSelect: (image: string) => void;
    onContinue: (url: string) => void;
    selectedImage: string | null;
}

export function UploadPhoto({ onContinue, onImageSelect, selectedImage }: UploadPhotoProps) {
    const [isDraggin, setIsDraggin] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string>('')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [fileSize, setFileSize] = useState<number>(0)
    const [fileType, setFileType] = useState<string>('')

    const generateMutation = useMutation ({
        mutationFn: generateProfessionalPhoto,
            onSuccess: (response)=> {

                 if(response?.data?.generateImage){
                    
                    onContinue(response?.data?.generateImage);
                 }       
        },
        onError: (error: Error) => {
            console.error('Erro ao gerar imagem:', error);
        }

    })

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];

        if (file && file.type.startsWith('image/')) {
            setFileName(file.name);
            setFileSize(file.size);
            setFileType(file.type);

            const reader = new FileReader();
            reader.onloadend = () => {
                // CORREÇÃO: Usar reader.result para pegar o Base64
                const base64 = reader.result as string;
                console.log(base64);
                onImageSelect(base64);
            }
            reader.readAsDataURL(file);

        }

    };




    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggin(true);
    };

    const handleRemoveImage = () => {
        setFileName('');
        setFileSize(0);
        setFileType('');
        onImageSelect('');

    }


    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggin(false);
    }


    const handleGeneratePhoto = async () =>{
        if(!selectedImage) return;

        try{
            
             
            await generateMutation.mutateAsync({
                imageURL: selectedImage,
                fileName: fileName,
                fileType: fileType,
                fileSize: fileSize,
            }) 
            
           console.log("Enviando imagem...", { selectedImage, fileName, fileType, fileSize });
        }catch(error){
            console.error('Erro ao gerar imagem:', error);
        }
    }



    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setFileSize(file.size);
            setFileType(file.type);
            onImageSelect(URL.createObjectURL(file));
        }
    }



    const handleGenerateImage = () => {
        console.log("Gerar imagem")
    }

    return (
        <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-sm border">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Envie sua foto</h2>
                <p className="text-muted-foreground text-sm">
                    Escolha uma foto sua para transformar em um retrato profissional.
                    Funciona melhor com fotos onde seu rosto está bem visível.
                </p>
            </div>

            {!selectedImage ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed transition-colors rounded-xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer bg-muted/5 ${isDraggin ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                        }`}
                >
                    <div className="bg-background p-4 rounded-full shadow-sm">
                        <Upload className="size-6 text-primary" />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="font-medium">Arraste sua foto aqui ou clique para selecionar</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP</p>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageSelect}
                    />
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden border bg-muted">
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    <Button 
                        className="w-full h-12 text-lg gap-2"
                        onClick={handleGeneratePhoto}
                        disabled={generateMutation.isPending}
                    >
                        <Sparkles className="size-5" />
                        {generateMutation.isPending ? "Gerando..." : "Gerar foto profissional"}
                    </Button>
                </div>
            )}
        </div>
    );
}