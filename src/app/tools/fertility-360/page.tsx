import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OvulationCalculator } from "./ovulation-calculator";
import { Baby, CalendarDays, TestTube, Wallet } from "lucide-react";

export default function FertilityToolkitPage() {
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
          <div className="text-center mb-8">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl text-shadow-neon-primary">
              Fertility360 — Reproductive Health
            </h1>
            <p className="mt-2 text-muted-foreground">
              A suite of tools to support you on your reproductive health journey.
            </p>
            <p className="mt-1 text-xs text-destructive">
              Disclaimer: For educational and informational purposes only. Consult a healthcare professional.
            </p>
          </div>
          
          <Tabs defaultValue="ovulation" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ovulation">
                <CalendarDays className="mr-2" />
                Ovulation Calculator
              </TabsTrigger>
              <TabsTrigger value="due_date" disabled>
                 <Baby className="mr-2" />
                Due Date Calculator
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ovulation">
              <OvulationCalculator />
            </TabsContent>
            <TabsContent value="due_date">
              {/* Placeholder for future tool */}
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </div>
  );
}
