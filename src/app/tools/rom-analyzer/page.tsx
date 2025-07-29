
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { RomAnalyzer } from "./rom-analyzer";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function RomAnalyzerPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent">
      <AppHeader />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <Link href="/#tools">
            <Button variant="ghost" className="mb-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Tools
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl text-shadow-neon-primary">
              Orthopedic ROM Analyzer
            </h1>
            <p className="mt-2 text-muted-foreground">
              Analyze range of motion from an image of a joint.
            </p>
             <p className="mt-1 text-xs text-destructive">
              Disclaimer: This is an AI-powered educational tool and not a substitute for clinical goniometry.
            </p>
          </div>
          <RomAnalyzer />
        </div>
      </main>
    </div>
  );
}
