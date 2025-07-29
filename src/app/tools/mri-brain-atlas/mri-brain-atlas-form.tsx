"use client";

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  analyzeMriBrain,
  type MriBrainAtlasOutput,
} from '@/ai/flows/mri-brain-atlas-flow';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Upload, BrainCircuit, BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const formSchema = z.object({
  photoDataUri: z.string({ required_error: 'A brain MRI image is required.' }),
});

export function MriBrainAtlasForm() {
  const [result, setResult] = useState<MriBrainAtlasOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        form.setValue('photoDataUri', dataUri);
        setPhotoPreview(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await analyzeMriBrain(values);
      setResult(analysisResult);
    } catch (error) {
      console.error('Error analyzing MRI:', error);
      toast({
        title: 'An Error Occurred',
        description: 'Failed to analyze the MRI. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-8">
       <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Form */}
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="photoDataUri"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-lg">Brain MRI Image</FormLabel>
                        <FormControl>
                        <div className="space-y-4">
                            <div className="w-full aspect-square rounded-md bg-muted overflow-hidden flex items-center justify-center">
                            {photoPreview ? (
                                <Image src={photoPreview} alt="MRI preview" width={400} height={400} className="object-contain h-full w-full"/>
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <Upload className="mx-auto h-12 w-12" />
                                    <p>Click to upload an image</p>
                                </div>
                            )}
                            </div>
                            <Button type="button" onClick={() => fileInputRef.current?.click()} className="w-full">
                                <Upload className="mr-2" />
                                {photoPreview ? "Change Image" : "Upload Image"}
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading || !photoPreview}>
                    {isLoading ? (
                    <><Loader2 className="animate-spin" /> Analyzing...</>
                    ) : (
                    <><BrainCircuit /> Analyze Structures</>
                    )}
                </Button>
                </form>
            </Form>
        </div>

        {/* Right Column: Results */}
        <div className="space-y-6">
            {isLoading && (
            <>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-48 w-full" />
            </>
            )}

            {result && (
            <>
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2">Summary</CardTitle></CardHeader>
                    <CardContent><p>{result.summary}</p></CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen /> Identified Structures</CardTitle></CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {result.identifiedStructures.map((item, index) => (
                                <AccordionItem value={`item-${index}`} key={item.structure}>
                                    <AccordionTrigger>{item.structure}</AccordionTrigger>
                                    <AccordionContent>{item.description}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </>
            )}
        </div>
       </div>
    </div>
  );
}
