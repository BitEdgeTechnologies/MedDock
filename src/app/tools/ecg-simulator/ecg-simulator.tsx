"use client";

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

const ecgPatterns = {
  normal_sinus_rhythm: {
    name: 'Normal Sinus Rhythm',
    imageUrl: 'https://placehold.co/800x300.png',
    dataAiHint: 'ecg normal',
    description:
      'The normal rhythm of the heart, where electrical impulses originate from the sinoatrial (SA) node and travel through the normal conduction pathway.',
    characteristics: [
      'Rate: 60-100 bpm',
      'Rhythm: Regular',
      'P wave: Upright, one for every QRS',
      'PR interval: 0.12-0.20 seconds',
      'QRS complex: <0.12 seconds',
    ],
  },
  atrial_fibrillation: {
    name: 'Atrial Fibrillation (A-Fib)',
    imageUrl: 'https://placehold.co/800x300.png',
    dataAiHint: 'ecg afib',
    description:
      'A chaotic and irregular atrial rhythm where multiple impulses originate from various locations in the atria, leading to an irregular ventricular response.',
    characteristics: [
      'Rate: Atrial rate >350 bpm; ventricular rate varies',
      'Rhythm: Irregularly irregular',
      'P wave: Not identifiable, replaced by fibrillatory waves',
      'PR interval: Not measurable',
      'QRS complex: Usually normal width',
    ],
  },
  ventricular_tachycardia: {
    name: 'Ventricular Tachycardia (V-Tach)',
    imageUrl: 'https://placehold.co/800x300.png',
    dataAiHint: 'ecg vtach',
    description:
      'A rapid heart rhythm originating from an ectopic focus in the ventricles. It is a life-threatening arrhythmia that can lead to ventricular fibrillation.',
    characteristics: [
      'Rate: 100-250 bpm',
      'Rhythm: Regular or slightly irregular',
      'P wave: Usually not visible; if seen, they have no relation to the QRS',
      'PR interval: Not measurable',
      'QRS complex: Wide (>0.12 seconds), bizarre appearance',
    ],
  },
  st_elevation_mi: {
    name: 'ST-Elevation Myocardial Infarction (STEMI)',
    imageUrl: 'https://placehold.co/800x300.png',
    dataAiHint: 'ecg stemi',
    description:
      'A type of heart attack where a coronary artery is completely blocked, causing injury and ischemia to the heart muscle, reflected by ST-segment elevation on the ECG.',
    characteristics: [
      'ST Segment: Elevation >1mm in two or more contiguous leads',
      'Q waves: May be present, indicating necrosis',
      'T waves: May be hyperacute (tall and peaked) initially, then invert',
      'Reciprocal ST depression may be seen in opposite leads',
    ],
  },
};

type PatternKey = keyof typeof ecgPatterns;

export function EcgSimulator() {
  const [selectedPattern, setSelectedPattern] = useState<PatternKey>('normal_sinus_rhythm');

  const pattern = ecgPatterns[selectedPattern];

  return (
    <div className="mt-8 space-y-6">
      <Card>
        <CardHeader>
          <Label htmlFor="pattern-select" className="text-lg">Select ECG Pattern</Label>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedPattern}
            onValueChange={(value) => setSelectedPattern(value as PatternKey)}
          >
            <SelectTrigger id="pattern-select">
              <SelectValue placeholder="Select a pattern" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ecgPatterns).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>{pattern.name}</CardTitle>
        </CardHeader>
        <CardContent>
             <div className="bg-muted rounded-md p-2 mb-6">
                <Image
                    src={pattern.imageUrl}
                    alt={`${pattern.name} ECG strip`}
                    width={800}
                    height={300}
                    className="w-full rounded"
                    data-ai-hint={pattern.dataAiHint}
                />
             </div>
             <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-muted-foreground">{pattern.description}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg mb-2">Key Characteristics</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {pattern.characteristics.map(char => <li key={char}>{char}</li>)}
                    </ul>
                </div>
             </div>
        </CardContent>
      </Card>

    </div>
  );
}
