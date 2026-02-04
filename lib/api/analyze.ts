import { promises } from "dns";



interface GeneratePhotoRequest {
    
    imageURL: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
}

interface GeneratePhotoResponse {
    success: boolean;
    message: string;
    data:{
        originalImage: string;
        generateImage?: string;
        fileName?: string;
        fileType?: string;
        fileSize?: number;
        [key: string]: unknown;
    },
    error?: string;
}

export async function generateProfessionalPhoto(
  request: GeneratePhotoRequest
): Promise<GeneratePhotoResponse> {
    const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request)
    });

    if(!response.ok){
         const error = await response.json();
         throw new Error(error.error || "Erro ao gerar imagem");
    }

    return response.json();
           
    
}
