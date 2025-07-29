import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { DrugInteractionCheckerForm } from "./drug-interaction-checker-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function DrugInteractionCheckerPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent">
      <AppHeader />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <Link href="/#tools">
            <Button variant="ghost" className="mb-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Tools
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl text-shadow-neon-primary">
              Drug Interaction Checker
            </h1>
            <p className="mt-2 text-muted-foreground">
              Enter a list of drugs to check for potential interactions.
            </p>
             <p className="mt-1 text-xs text-destructive">
              Disclaimer: This tool is for informational purposes only. Always consult a healthcare professional.
            </p>
          </div>
          <DrugInteractionCheckerForm />
        </div>
      </main>
    </div>
  );
}
