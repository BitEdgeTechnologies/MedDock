import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { LabRanges } from "./lab-ranges";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function LabTestRangesPage() {
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
              Common Lab Test Ranges
            </h1>
            <p className="mt-2 text-muted-foreground">
              Reference values for common laboratory tests.
            </p>
             <p className="mt-1 text-xs text-destructive">
              Disclaimer: Normal ranges can vary by laboratory, population, and method. Always consult your local lab's reference ranges.
            </p>
          </div>
          <LabRanges />
        </div>
      </main>
    </div>
  );
}
