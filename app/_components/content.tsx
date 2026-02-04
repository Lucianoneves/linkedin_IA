"use client"

import { useState } from "react";
import { Header } from "./header";
import { Hero } from "./hero";
import { UploadPhoto } from "./upload-photo";

export function HomeContent() {

  const [selectedImage, setSelectedImage] = useState<string | null>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>("");

  const handleImageChange = (image: string) => { // função para atualizar a imagem selecionada
    setSelectedImage(image || null);
  }

  const handleContinue = (url: string) => { // função para continuar para a próxima etapa
    if (selectedImage) {
      setGeneratedImage(selectedImage);
    }
  }

  const handleStart = () => { // função para reiniciar o processo
    setSelectedImage("");
    setGeneratedImage("");
  }


  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-200px)]">
          <div className="flex items-center justify-center lg:justify-start">
            <Hero />
          </div>
          <div className="flex items-center justify-center">
            <UploadPhoto
              onImageSelect={handleImageChange}
              onContinue={handleContinue}
              selectedImage={selectedImage}
            />
          </div>
        </div>

      </main>
    </>
  );
}