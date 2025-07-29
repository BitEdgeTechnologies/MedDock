
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { ColorBlindnessTest } from "./color-blind-test";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function ColorBlindnessTestPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent">
      <AppHeader />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-xl">
          <Link href="/#tools">
            <Button variant="ghost" className="mb-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Tools
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl text-shadow-neon-primary">
              Color Blindness Test
            </h1>
            <p className="mt-2 text-muted-foreground">
              A screening tool for color vision deficiency using Ishihara-style plates.
            </p>
             <p className="mt-1 text-xs text-destructive">
              Disclaimer: This is a screening tool, not a substitute for a professional diagnosis by an optometrist.
            </p>
          </div>
          <ColorBlindnessTest />
        </div>
      </main>
    </div>
  );
}

