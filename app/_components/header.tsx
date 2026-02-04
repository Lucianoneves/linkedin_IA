import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="w-full border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition-opacity">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
            <Sparkles className="size-5" />
          </div>
          <span>LinkedIn IA</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Entrar
          </Button>
          <Button size="sm">
            Começar Grátis
          </Button>
        </nav>
      </div>
    </header>
  );
}