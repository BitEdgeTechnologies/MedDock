import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { tools } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as LucideIcons from "lucide-react";
import type { IconName } from "@/lib/constants";

type Tool = {
  name: string;
  description: string;
  href: string;
  icon: IconName;
  category: string;
};

const categorizedTools = tools.reduce((acc, tool) => {
  const category = tool.category || "General";
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(tool as Tool);
  return acc;
}, {} as Record<string, Tool[]>);

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent">
      <AppHeader />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-foreground sm:text-5xl text-shadow-neon-primary">
              About MedDeck.io
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground md:text-xl">
              Your All-in-One Medical Toolkit
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              MedDeck.io is a comprehensive platform designed to empower healthcare professionals, medical students, and patients with a suite of over 100 powerful, AI-driven tools. Our mission is to streamline clinical workflows, enhance medical education, and provide accessible health information, all in one place.
            </p>
          </div>
          
          <div className="space-y-12">
            {Object.entries(categorizedTools).map(([category, toolsInCategory]) => {
                const CategoryIcon = LucideIcons[toolsInCategory[0].icon] || LucideIcons.FlaskConical;
                return (
                    <div key={category}>
                        <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground mb-6 flex items-center gap-3">
                            <CategoryIcon className="h-8 w-8 text-primary"/>
                            {category}
                        </h2>
                        <div className="space-y-4">
                            {toolsInCategory.map(tool => {
                                const ToolIcon = LucideIcons[tool.icon] || LucideIcons.FlaskConical;
                                return (
                                <Link href={tool.href} key={tool.name} className="block">
                                    <Card className="hover:border-primary hover:bg-muted/40 transition-all">
                                        <CardHeader className="flex flex-row items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                                <ToolIcon className="h-6 w-6 text-primary" />
                                             </div>
                                             <div>
                                                <CardTitle className="text-xl">{tool.name}</CardTitle>
                                             </div>
                                        </CardHeader>
                                         <CardContent>
                                            <p className="text-muted-foreground">{tool.description}</p>
                                         </CardContent>
                                    </Card>
                                </Link>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
          </div>

        </div>
      </main>
    </div>
  );
}
