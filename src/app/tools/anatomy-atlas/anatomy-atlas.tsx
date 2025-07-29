"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const anatomySystems = [
  {
    system: "Skeletal System",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "skeletal system",
    description: "The framework of the body, consisting of bones and other connective tissues, which protects and supports the body tissues and internal organs.",
    components: ["Bones", "Cartilage", "Ligaments", "Tendons"],
  },
  {
    system: "Muscular System",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "muscular system",
    description: "Composed of specialized cells called muscle fibers. Their predominant function is contractibility. Muscles, attached to bones or internal organs and blood vessels, are responsible for movement.",
    components: ["Skeletal muscle", "Smooth muscle", "Cardiac muscle"],
  },
  {
    system: "Cardiovascular System",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "cardiovascular system",
    description: "Made up of the heart and blood vessels, the cardiovascular system is responsible for pumping blood throughout the body to transport nutrients, oxygen, and waste products.",
    components: ["Heart", "Arteries", "Veins", "Capillaries"],
  },
  {
    system: "Nervous System",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "nervous system",
    description: "The body's primary communication and control network. It consists of the brain, spinal cord, and a vast network of nerves that transmit signals between different parts of the body.",
    components: ["Brain", "Spinal Cord", "Nerves", "Ganglia"],
  },
];

export function AnatomyAtlas() {
  return (
    <div className="mt-8">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {anatomySystems.map((item) => (
          <Card key={item.system}>
            <AccordionItem value={item.system} className="border-b-0">
              <AccordionTrigger className="p-6">
                <CardTitle className="text-xl">{item.system}</CardTitle>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{item.description}</p>
                    <div>
                      <h4 className="font-semibold mb-2">Key Components:</h4>
                      <ul className="list-disc pl-5 text-muted-foreground">
                        {item.components.map((comp) => <li key={comp}>{comp}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-muted rounded-md p-2">
                    <Image
                      src={item.imageUrl}
                      alt={`${item.system} diagram`}
                      width={600}
                      height={400}
                      className="w-full rounded"
                      data-ai-hint={item.dataAiHint}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
    </div>
  );
}
