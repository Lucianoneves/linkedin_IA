import Image from "next/image";

export function Hero() {
  return (
    <div className="flex flex-col gap-6 text-center lg:text-left">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Fotos profissionais <br />
        para o linkedin
      </h1>
      <p className="text-lg text-muted-foreground max-w-[600px] mx-auto lg:mx-0">
        Transforme qualquer foto sua em um retrato profissional de alta qualidade usando inteligência artificial. Perfeito para seu perfil do LinkedIn.
      </p>
      
      <div className="flex gap-4 justify-center lg:justify-start mt-4">
        {/* Placeholders para as imagens de exemplo */}
        <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-muted">
           <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" alt="Exemplo 1" className="object-cover w-full h-full" />
        </div>
        <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-muted">
           <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200" alt="Exemplo 2" className="object-cover w-full h-full" />
        </div>
        <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-muted">
           <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200" alt="Exemplo 3" className="object-cover w-full h-full" />
        </div>
      </div>
    </div>
  );
}