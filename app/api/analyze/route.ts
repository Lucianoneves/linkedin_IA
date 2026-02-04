import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";


const analyzeRequestSchema = z.object({
    imageURL: z.string().min(1, "URL da imagem é obrigatória"),
    fileName: z.string().optional(),
    fileType: z.string().optional(),
    fileSize: z.number().optional(),
})

export async function POST( Request: NextRequest) {
   try {
    const body = await Request.json();
    const validation =  analyzeRequestSchema.safeParse(body);

    if(!validation.success){
        return NextResponse.json(
            {
            success: false,
            error: "Erro ao analisar e gerar foto",
       
        },
       {status: 400},
    )
    }

    const {imageURL, fileName, fileType, fileSize} = validation.data;

      const base64Data = imageURL.split(",")[1];
      const mimeType = imageURL.match(/data:([^;]+);/)?.[1] || "image/jpeg";
      const buffer = Buffer.from(base64Data, "base64");
      const blob = new Blob([buffer], { type: mimeType });

      const formData = new FormData();
      
      formData.append("data", blob, fileName || "image.jpg");
    
     
    // Simulação de resposta bem-sucedida para teste
    return NextResponse.json({
        success: true,
        data: {
            originalImage: imageURL,
            generateImage: "https://via.placeholder.com/400", // Placeholder para teste
            fileName,
            fileType
        }
    });

}catch(error){
 console.log("Falha API/ANALYZE", error);
 return NextResponse.json(
     {
     success: false,
     message: "Erro ao gerar imagem",       
 },
{status: 500},
)
}
}
   
