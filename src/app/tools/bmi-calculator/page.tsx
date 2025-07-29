import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const BmiCalculatorForm = dynamic(() => import('./bmi-calculator-form').then(mod => mod.BmiCalculatorForm), {
  loading: () => <Skeleton className="h-[400px] w-full" />
});

export default function BmiCalculatorPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent">
      <AppHeader />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <Link href="/#tools">
            <Button variant="ghost" className="mb-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Tools
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl text-shadow-neon-primary">
              BMI Calculator
            </h1>
            <p className="mt-2 text-muted-foreground">
              Calculate your Body Mass Index.
            </p>
          </div>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <BmiCalculatorForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
