
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft, BarChartHorizontal, Lightbulb } from "lucide-react";
import Image from "next/image";

export default function VisualDiagnosisPage() {
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
              Your Condition Visualized
            </h1>
            <p className="mt-2 text-muted-foreground">
              AI converts any diagnosis into a simple, infographic-style visual explanation.
            </p>
             <p className="mt-1 text-xs text-destructive">
              This is a conceptual tool. The functionality is for demonstration purposes only.
            </p>
          </div>
          <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChartHorizontal/> 
                        Type 2 Diabetes: An Overview
                    </CardTitle>
                    <CardDescription>An AI-generated visual summary.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center p-4">
                        <Image
                            src="https://placehold.co/800x450.png"
                            alt="Sample Infographic for Type 2 Diabetes"
                            width={800}
                            height={450}
                            className="rounded-md"
                            data-ai-hint="medical infographic"
                        />
                    </div>
                </CardContent>
            </Card>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb/> How it would work:</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                    <p>1. You would enter a medical condition (e.g., "Hypertension").</p>
                    <p>2. Our generative AI would create a custom infographic explaining the condition.</p>
                    <p>3. The visual would cover key points like "What is it?", "Common Symptoms", "Risk Factors", and "Management Tips" in an easy-to-digest format.</p>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
