import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const AnatomyAtlas = dynamic(() => import('./anatomy-atlas').then(mod => mod.AnatomyAtlas), {
  loading: () => <Skeleton className="h-[400px] w-full" />
});

export default function AnatomyAtlasPage() {
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
              Anatomy Atlas
            </h1>
            <p className="mt-2 text-muted-foreground">
              Explore the major systems of the human body.
            </p>
            <p className="mt-1 text-xs text-destructive">
              Disclaimer: This is for educational purposes only.
            </p>
          </div>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <AnatomyAtlas />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
