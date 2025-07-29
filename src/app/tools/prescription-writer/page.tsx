import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { PrescriptionForm } from "./prescription-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PrescriptionWriterPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent">
      <AppHeader />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl print:max-w-full">
          <Link href="/#tools" className="print:hidden">
            <Button variant="ghost" className="mb-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Tools
            </Button>
          </Link>
          <div className="text-center print:hidden">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl text-shadow-neon-primary">
              Prescription Writer
            </h1>
            <p className="mt-2 text-muted-foreground">
              Generate and print formatted prescriptions.
            </p>
             <p className="mt-1 text-xs text-destructive">
              Disclaimer: For use by qualified healthcare professionals only. Ensure all details are accurate.
            </p>
          </div>
          <PrescriptionForm />
        </div>
      </main>
    </div>
  );
}
