"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Activity, BookOpen, Calculator, Stethoscope } from "lucide-react";

const quickTools = [
    { name: "ECG Simulator", href: "/tools/ecg-simulator", description: "Practice identifying rhythms." },
    { name: "CHA2DS2-VASc Score", href: "/tools/cha2ds2-vasc", description: "AFib stroke risk." },
    { name: "Wells Score for DVT/PE", href: "/tools/wells-score", description: "Assess VTE risk." },
    { name: "BP Log", href: "/tools/bp-log", description: "Track patient readings." },
];

const murmurs = [
    { name: "Aortic Stenosis", timing: "Systolic", sound: "Crescendo-decrescendo", radiation: "Carotids" },
    { name: "Mitral Regurgitation", timing: "Systolic", sound: "Holosystolic", radiation: "Axilla" },
    { name: "Aortic Regurgitation", timing: "Diastolic", sound: "Decrescendo", radiation: "Left sternal border" },
    { name: "Mitral Stenosis", timing: "Diastolic", sound: "Mid-diastolic rumble", radiation: "None" },
];

export function CardiologyToolkit() {
  return (
    <div className="mt-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickTools.map((tool) => (
          <Link href={tool.href} key={tool.name}>
            <Card className="h-full hover:border-primary transition-colors flex flex-col">
              <CardHeader>
                <CardTitle>{tool.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity /> ECG Lead Placement</CardTitle>
            <CardDescription>Standard 12-lead ECG placement guide.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Image 
                src="https://placehold.co/400x350.png"
                alt="ECG Lead Placement Diagram"
                width={400}
                height={350}
                className="rounded-md"
                data-ai-hint="ecg placement"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Stethoscope /> Common Heart Murmurs</CardTitle>
            <CardDescription>A quick reference for common valvular defects.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Murmur</TableHead>
                  <TableHead>Timing</TableHead>
                  <TableHead>Sound</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {murmurs.map((murmur) => (
                  <TableRow key={murmur.name}>
                    <TableCell className="font-medium">{murmur.name}</TableCell>
                    <TableCell>{murmur.timing}</TableCell>
                    <TableCell>{murmur.sound}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
