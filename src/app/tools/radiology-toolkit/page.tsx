import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Bone, PictureInPicture, Scan, BrainCircuit } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

const tools = [
  { 
    name: "X-Ray Interpreter", 
    description: "AI-powered assistant for interpreting X-ray images.", 
    href: "/tools/x-ray-interpreter",
    icon: Bone
  },
  { 
    name: "Ultrasound Image Analyzer", 
    description: "AI-powered assistant for interpreting ultrasound images.", 
    href: "/tools/ultrasound-image-analyzer",
    icon: PictureInPicture
  },
  { 
    name: "CT Scan Analyzer", 
    description: "Analyze CT scan images with an AI-powered assistant.", 
    href: "/tools/ct-scan-analyzer",
    icon: Scan
  },
  { 
    name: "MRI Brain Atlas", 
    description: "An interactive AI atlas for identifying structures in brain MRIs.", 
    href: "/tools/mri-brain-atlas",
    icon: BrainCircuit
  },
];

export default function RadiologyToolkitPage() {
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
              Radiology Toolkit
            </h1>
            <p className="mt-2 text-muted-foreground">
              A centralized hub for X-Ray, Ultrasound, CT, and MRI analysis tools.
            </p>
            <p className="mt-1 text-xs text-destructive">
              Disclaimer: Tools are for educational and informational purposes only.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map(tool => {
                const Icon = tool.icon;
                return (
                    <Link href={tool.href} key={tool.name}>
                        <Card className="h-full hover:border-primary transition-colors">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Icon className="text-primary"/>
                                    {tool.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{tool.description}</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                )
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
