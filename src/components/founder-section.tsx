
"use client";

import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

export function FounderSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section id="about" ref={ref} className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className={cn("rounded-2xl bg-card shadow-2xl ring-1 ring-white/10 transition-opacity duration-1000 ease-in", inView ? "opacity-100" : "opacity-0")}>
            <div className="grid grid-cols-1 items-center gap-x-8 gap-y-16 p-8">
                <div className={cn("transition-transform duration-1000 ease-in-out delay-200 text-center", inView ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0")}>
                    <div className="text-base leading-7 text-muted-foreground">
                        <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Meet the Founder</h2>
                        <h3 className="mt-2 text-xl font-bold text-primary">Dr. Arslan Maverick</h3>
                        <p className="mt-1 text-sm font-semibold">Founder & CEO – MedDeck.io</p>
                        <p className="mt-1 text-sm text-muted-foreground">MBBS | Digital Health Innovator | Medical AI Strategist</p>
                        <div className="mt-6 space-y-4 max-w-2xl mx-auto">
                            <p>Dr. Arslan Maverick is a new-generation physician, visionary technologist, and the founder of MedDeck.io, a cutting-edge digital health platform offering 100+ smart medical tools to clinicians, students, and patients worldwide.</p>
                            <p>After completing his MBBS with honors, Dr. Maverick quickly realized that while medical knowledge was advancing, the tools available to doctors remained outdated and fragmented. He envisioned a centralized medical toolkit powered by AI, design thinking, and real-world clinical workflows.</p>
                            <p className="font-semibold text-foreground italic">"To equip every doctor with superpowers — not in theory, but at their fingertips."</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
