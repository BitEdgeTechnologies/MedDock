
"use client";

import { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, Move, FileText } from 'lucide-react';
import Image from 'next/image';

interface AnalysisResult {
    joint: string;
    flexion: number;
    extension: number;
    notes: string;
}

export function RomAnalyzer() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null); // Reset result when new image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (!imagePreview) return;
    
    setIsLoading(true);
    // Simulate AI analysis
    setTimeout(() => {
        setResult({
            joint: "Knee",
            flexion: 135,
            extension: 5,
            notes: "Range of motion appears to be within normal limits for a healthy adult knee. No obvious signs of contracture or hyper-extension from this static image."
        });
        setIsLoading(false);
    }, 2000);
  };


  return (
    <div className="mt-8 grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Upload Joint Image</CardTitle>
          <CardDescription>Upload an image of a joint (e.g., knee, elbow) in flexion or extension.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div 
                className="w-full aspect-video rounded-md bg-muted overflow-hidden flex items-center justify-center border-dashed border-2 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                {imagePreview ? (
                    <Image src={imagePreview} alt="Joint preview" width={400} height={300} className="object-contain h-full w-full"/>
                ) : (
                    <div className="text-center text-muted-foreground p-4">
                        <Upload className="mx-auto h-12 w-12" />
                        <p>Click to upload an image</p>
                        <p className="text-xs">PNG, JPG, or WEBP</p>
                    </div>
                )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
            />
            <Button onClick={handleAnalyze} disabled={!imagePreview || isLoading} className="w-full">
                {isLoading ? (
                    <><Move className="animate-spin mr-2"/> Analyzing...</>
                ) : (
                    <><Move className="mr-2"/> Analyze Range of Motion</>
                )}
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>AI-powered estimation of the joint's range of motion.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {isLoading && (
                <div className="space-y-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            )}
            {result && !isLoading && (
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold">Detected Joint</h3>
                        <p className="text-primary text-lg font-bold">{result.joint}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <h3 className="font-semibold">Estimated Flexion</h3>
                            <p className="text-2xl font-bold">{result.flexion}°</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Estimated Extension</h3>
                            <p className="text-2xl font-bold">{result.extension}°</p>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold flex items-center gap-2"><FileText size={16}/> Clinical Notes</h3>
                        <p className="text-muted-foreground mt-1 text-sm">{result.notes}</p>
                    </div>
                </div>
            )}
             {!result && !isLoading && (
                <div className="text-center text-muted-foreground pt-12">
                    <p>Upload an image and click "Analyze" to see the results here.</p>
                </div>
             )}
        </CardContent>
      </Card>
    </div>
  );
}
