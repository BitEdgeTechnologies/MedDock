
"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  identifyPill,
  type PillIdentifierOutput,
} from '@/ai/flows/pill-identifier-flow';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
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
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Camera, Pill, TestTube, AlertTriangle, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const formSchema = z.object({
  photoDataUri: z.string({ required_error: 'A photo of the pill is required.' }),
  imprint: z.string().optional(),
  color: z.string().optional(),
  shape: z.string().optional(),
});

export function PillIdentifierForm() {
  const [result, setResult] = useState<PillIdentifierOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imprint: '',
      color: '',
      shape: '',
    }
  });

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();
  }, []);

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

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        form.setValue('photoDataUri', dataUri);
        setPhotoPreview(dataUri);
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const pillResult = await identifyPill(values);
      setResult(pillResult);
    } catch (error) {
      console.error('Error identifying pill:', error);
      toast({
        title: 'An Error Occurred',
        description: 'Failed to identify the pill. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="photoDataUri"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Pill Photo</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="w-full aspect-video rounded-md bg-muted overflow-hidden flex items-center justify-center">
                      {photoPreview ? (
                        <Image src={photoPreview} alt="Pill preview" width={300} height={200} className="object-contain h-full w-full"/>
                      ) : (
                         <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline/>
                      )}
                    </div>
                     {hasCameraPermission === false && (
                        <Alert variant="destructive">
                            <AlertTitle>Camera Access Denied</AlertTitle>
                            <AlertDescription>
                            Please enable camera permissions or upload a file.
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="flex gap-2">
                       <Button type="button" onClick={capturePhoto} disabled={!hasCameraPermission || isLoading} className="flex-1">
                        <Camera className="mr-2" />
                        Capture
                      </Button>
                      <Button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1">
                        Upload Image
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="imprint" render={({ field }) => (
              <FormItem>
                <FormLabel>Imprint</FormLabel>
                <FormControl><Input placeholder="e.g., '93 73'" {...field} /></FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="color" render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl><Input placeholder="e.g., 'White'" {...field} /></FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="shape" render={({ field }) => (
              <FormItem>
                <FormLabel>Shape</FormLabel>
                <FormControl><Input placeholder="e.g., 'Round'" {...field} /></FormControl>
              </FormItem>
            )} />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="animate-spin" /> Identifying...</>
            ) : (
              <><Pill /> Identify Pill</>
            )}
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-10 space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Pill /> {result.medicationName} ({result.strength})</CardTitle></CardHeader>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TestTube /> Common Uses</CardTitle></CardHeader>
            <CardContent><p>{result.commonUses}</p></CardContent>
          </Card>
          <Card className="border-destructive bg-destructive/5">
            <CardHeader><CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle /> Important Warnings</CardTitle></CardHeader>
            <CardContent><p>{result.importantWarnings}</p></CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
