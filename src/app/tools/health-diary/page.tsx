
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { HealthDiaryForm } from "./diary-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function HealthDiaryPage() {
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
              Virtual Health Diary
            </h1>
            <p className="mt-2 text-muted-foreground">
              Keep a simple log of your symptoms, mood, and daily activities to share with your doctor.
            </p>
             <p className="mt-1 text-xs text-destructive">
              Note: Data is not saved. Please print or save your entries before leaving the page.
            </p>
          </div>
          <HealthDiaryForm />
        </div>
      </main>
    </div>
  );
}
