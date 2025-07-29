import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Brain } from "lucide-react";

const tools = [
  { name: "NIH Stroke Scale", description: "Assess stroke severity.", href: "#" },
  { name: "Glasgow Coma Scale", description: "Assess consciousness level.", href: "#" },
  { name: "Cranial Nerve Exam Guide", description: "Step-by-step guide.", href: "#" },
  { name: "Seizure Diary", description: "Template to track seizure activity.", href: "#" },
];

export default function NeurologyToolkitPage() {
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
          <div className="text-center mb-8">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl text-shadow-neon-primary">
              Neurology Toolkit
            </h1>
            <p className="mt-2 text-muted-foreground">
              Essential tools for neurological assessment and reference.
            </p>
            <p className="mt-1 text-xs text-destructive">
              Disclaimer: For educational and informational purposes only.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map(tool => (
                <Link href={tool.href} key={tool.name}>
                    <Card className="h-full hover:border-primary transition-colors">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Brain className="text-primary"/>
                                {tool.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{tool.description}</CardDescription>
                        </CardContent>
                    </Card>
                </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
