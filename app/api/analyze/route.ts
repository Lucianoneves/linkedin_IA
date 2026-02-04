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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {imageURL, fileName, fileType, fileSize} = validation.data;

    // Extrair apenas o Base64
    // Tenta dividir por vírgula primeiro, que é o padrão universal para Data URLs (data:mime;base64,DATA)
    const parts = imageURL.split(",");
    const base64Data = parts.length > 1 ? parts[1] : imageURL;
    
      if (!base64Data) {
        throw new Error("Formato de imagem inválido (Base64 não encontrado)");
      }
      
      const buffer = Buffer.from(base64Data, "base64");
      
      // Criar o FormData
      const formData = new FormData();
      // O blob precisa ter o tipo definido corretamente
      const blob = new Blob([buffer], { type: fileType || "image/jpeg" });
      
      formData.append("data", blob, fileName || "image.jpg");
      // Adicionar outros campos se necessário
      // formData.append("json", JSON.stringify({ fileName, fileSize }));     
      

        // Enviar para o N8N (URL de Produção)
      const n8nMebhookURL ="https://lucianoneves.app.n8n.cloud/webhook-test/b05e483c-c2d5-4340-ad70-2c353f50ba94";
      const n8nresponse = await fetch (n8nMebhookURL, {
        method: "POST",
        body: formData,
        // Não definir Content-Type aqui, o fetch define automaticamente com o boundary
      });


      if(!n8nresponse.ok){
        const errorText = await n8nresponse.text();
        console.error("❌ ERRO N8N (Status " + n8nresponse.status + "):");
        console.error(errorText); // Isso vai mostrar a mensagem exata do N8N no terminal
        
        try {
             const errorJson = JSON.parse(errorText);
             throw new Error(errorJson.message || errorJson.error || "Erro ao gerar imagem no N8N");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
             throw new Error(`Erro N8N (${n8nresponse.status}): ${errorText.substring(0, 100)}...`);
        }
      }

      const response = await n8nresponse.json();

      console.log("Resposta N8N:", response);
    
      // Tenta extrair a URL da imagem da resposta do N8N (ajuste conforme o retorno real do seu workflow)
      // Exemplo: response.output, response.url, response[0].url, etc.
      const generatedImageURL = response.image || response.url || response.output || (typeof response === 'string' ? response : "");

    // Resposta real usando dados do N8N
    return NextResponse.json({
        success: true,
        data: {
            originalImage: imageURL,
            generateImage: generatedImageURL, 
            fileName,
            fileType,
            debugN8N: response // Para ajudar a debugar no frontend se a imagem não aparecer
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
   
