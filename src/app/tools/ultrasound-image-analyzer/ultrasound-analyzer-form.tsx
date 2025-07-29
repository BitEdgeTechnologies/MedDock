"use client";

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  interpretUltrasound,
  type UltrasoundInterpreterOutput,
} from '@/ai/flows/ultrasound-interpreter-flow';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Bone, FileText, Lightbulb, Loader2, Upload, PictureInPicture } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const formSchema = z.object({
  photoDataUri: z.string({ required_error: 'An ultrasound image is required.' }),
  clinicalContext: z.string().optional(),
});

export function UltrasoundAnalyzerForm() {
  const [result, setResult] = useState<UltrasoundInterpreterOutput | null>(null);
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
      const interpretationResult = await interpretUltrasound(values);
      setResult(interpretationResult);
    } catch (error) {
      console.error('Error interpreting ultrasound:', error);
      toast({
        title: 'An Error Occurred',
        description: 'Failed to interpret the ultrasound. Please try again later.',
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
                        <FormLabel className="text-lg">Ultrasound Image</FormLabel>
                        <FormControl>
                        <div className="space-y-4">
                            <div className="w-full aspect-square rounded-md bg-muted overflow-hidden flex items-center justify-center">
                            {photoPreview ? (
                                <Image src={photoPreview} alt="Ultrasound preview" width={400} height={400} className="object-contain h-full w-full"/>
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
                
                <FormField
                    control={form.control}
                    name="clinicalContext"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-lg">Clinical Context (Optional)</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="e.g., '34F with RUQ pain, query gallstones.'"
                            className="min-h-[100px] resize-y"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading || !photoPreview}>
                    {isLoading ? (
                    <><Loader2 className="animate-spin" /> Interpreting...</>
                    ) : (
                    <><PictureInPicture /> Interpret Ultrasound</>
                    )}
                </Button>
                </form>
            </Form>
        </div>

        {/* Right Column: Results */}
        <div className="space-y-6">
            {isLoading && (
            <>
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </>
            )}

            {result && (
            <>
                <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><FileText/> Findings</CardTitle></CardHeader>
                <CardContent><p className="whitespace-pre-wrap">{result.findings}</p></CardContent>
                </Card>
                <Card className="border-primary bg-primary/5">
                <CardHeader><CardTitle className="flex items-center gap-2 text-primary"><PictureInPicture/> Impression</CardTitle></CardHeader>
                <CardContent><p className="whitespace-pre-wrap">{result.impression}</p></CardContent>
                </Card>
                 <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Lightbulb/> Differential Diagnoses</CardTitle></CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                        {result.differentialDiagnoses.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                </CardContent>
                </Card>
            </>
            )}
        </div>
       </div>
    </div>
  );
}
