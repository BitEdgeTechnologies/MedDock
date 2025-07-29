import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { MmseScorerForm } from "./mmse-scorer-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function MmseScorerPage() {
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
              Mini-Mental State Exam (MMSE) Scorer
            </h1>
            <p className="mt-2 text-muted-foreground">
              A 30-point questionnaire for screening and monitoring cognitive function.
            </p>
             <p className="mt-1 text-xs text-destructive">
              Disclaimer: This tool is intended for use by qualified healthcare professionals.
            </p>
          </div>
          <MmseScorerForm />
        </div>
      </main>
    </div>
  );
}
