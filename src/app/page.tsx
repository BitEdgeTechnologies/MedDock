import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { AppHeader } from '@/components/app-header';
import { tools } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';

const ToolGrid = dynamic(() => import('@/components/tool-grid').then(mod => mod.ToolGrid), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
});
const FounderSection = dynamic(() => import('@/components/founder-section').then(mod => mod.FounderSection), {
  loading: () => <Skeleton className="h-[400px] w-full rounded-2xl" />,
});


export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent">
      <AppHeader />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-screen-xl">
          <section className="mb-12 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl text-shadow-neon-primary">
              MedDeck.io
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground md:text-xl">
              An all-in-one platform offering 100+ powerful medical tools. Designed for doctors, medical students, and patients.
            </p>
          </section>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <ToolGrid tools={tools} />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-2xl" />}>
            <FounderSection />
          </Suspense>
        </div>
      </main>
      <footer className="py-6 px-4 md:px-6">
        <div className="mx-auto w-full max-w-screen-xl text-center text-sm text-muted-foreground">
          © 2025 MedDeck.io. All Rights Reserved.
          <br />
          Crafted with care by 🩺 📚 ✨ 🫀
          <br />
          Empowering Healthcare with Precision Tools & AI
        </div>
      </footer>
    </div>
  );
}
