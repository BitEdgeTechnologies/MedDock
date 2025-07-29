
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft, Camera, ScanLine, Info } from "lucide-react";
import Image from "next/image";

export default function ScanMedsPage() {
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
              Scan My Meds
            </h1>
            <p className="mt-2 text-muted-foreground">
              Get drug guides, schedules, and interaction alerts by scanning your prescription.
            </p>
             <p className="mt-1 text-xs text-destructive">
              This is a conceptual tool. The functionality is for demonstration purposes only.
            </p>
          </div>
          <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ScanLine/> Prescription Scanner</CardTitle>
                    <CardDescription>Use your device's camera to scan a prescription paper.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <Camera className="h-16 w-16 text-muted-foreground"/>
                    </div>
                    <Button className="w-full" disabled>
                        <Camera className="mr-2"/>
                        Start Scanning
                    </Button>
                </CardContent>
            </Card>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Info/> How it would work:</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                    <p>1. You would scan your prescription using your camera.</p>
                    <p>2. Our AI would read the text and identify the medications listed.</p>
                    <p>3. The tool would provide you with a simple medication schedule, important warnings, and check for interactions with other drugs you've scanned.</p>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
