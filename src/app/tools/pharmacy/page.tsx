import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Pharmacy = dynamic(() => import('./pharmacy').then(mod => mod.Pharmacy), {
  loading: () => <Skeleton className="h-[600px] w-full" />
});

export default function PharmacyPage() {
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
              Pharmacy & Drug Reference
            </h1>
            <p className="mt-2 text-muted-foreground">
              Search for medications to find detailed information.
            </p>
            <p className="mt-1 text-xs text-destructive">
              Disclaimer: This information is for educational purposes only. Consult a healthcare professional for medical advice.
            </p>
          </div>
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <Pharmacy />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
