
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const snellenLines = [
  { vision: '20/200', letters: 'E', size: '9rem' },
  { vision: '20/100', letters: 'F P', size: '4.5rem' },
  { vision: '20/70', letters: 'T O Z', size: '3.15rem' },
  { vision: '20/50', letters: 'L P E D', size: '2.25rem' },
  { vision: '20/40', letters: 'P E C F D', size: '1.8rem' },
  { vision: '20/30', letters: 'E D F C Z P', size: '1.35rem' },
  { vision: '20/25', letters: 'F E L O P Z D', size: '1.125rem' },
  { vision: '20/20', letters: 'D E F P O T E C', size: '0.9rem' },
  { vision: '20/15', letters: 'L E F O D P C T', size: '0.675rem' },
];

export function SnellenTest() {
  const [currentLine, setCurrentLine] = useState(0);
  const [showResult, setShowResult] = useState<string | null>(null);

  const handleSelectLine = (lineIndex: number) => {
    setCurrentLine(lineIndex);
    setShowResult(`Vision Acuity: ${snellenLines[lineIndex].vision}`);
  };

  return (
    <div className="mt-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
          <CardDescription>
            Position yourself 20 feet (or 6 meters) away from the screen. Cover one eye and read the smallest line of letters you can. Then repeat with the other eye.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6 text-center font-mono font-bold tracking-widest">
          {snellenLines.map((line, index) => (
            <div
              key={line.vision}
              style={{ fontSize: line.size, lineHeight: '1.2' }}
              className={`transition-opacity duration-300 ${index <= currentLine ? 'opacity-100' : 'opacity-20'}`}
            >
              {line.letters}
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>What is the smallest line you can read clearly?</CardTitle>
        </CardHeader>
        <CardContent>
            <Select onValueChange={(value) => handleSelectLine(parseInt(value))}>
                <SelectTrigger>
                    <SelectValue placeholder="Select the line..." />
                </SelectTrigger>
                <SelectContent>
                    {snellenLines.map((line, index) => (
                        <SelectItem key={line.vision} value={String(index)}>
                            Line {index + 1} ({line.vision})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {showResult && (
                <p className="mt-4 text-center text-lg font-semibold text-primary">{showResult}</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

