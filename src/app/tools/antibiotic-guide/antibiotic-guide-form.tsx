"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  getAntibioticGuidance,
  type AntibioticGuideOutput,
} from '@/ai/flows/antibiotic-guide-flow';
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
import { Pill, Book, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  condition: z.string().min(3, {
    message: 'Please enter a medical condition.',
  }),
});

export function AntibioticGuideForm() {
  const [result, setResult] = useState<AntibioticGuideOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      condition: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const guideResult = await getAntibioticGuidance(values);
      setResult(guideResult);
    } catch (error) {
      console.error('Error getting antibiotic guidance:', error);
      toast({
        title: 'An Error Occurred',
        description: 'Failed to retrieve guidance. Please try again later.',
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
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Medical Condition</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 'Community-Acquired Pneumonia'" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="animate-spin" /> Searching...</>
            ) : (
              'Get Guidance'
            )}
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-10 space-y-6">
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-6">
          <Card>
            <CardHeader><CardTitle>{result.conditionSummary}</CardTitle></CardHeader>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Pill/> First-Line Antibiotics</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {result.firstLineAntibiotics.map(drug => <li key={drug}>{drug}</li>)}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Book/> Second-Line Antibiotics</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {result.secondLineAntibiotics.map(drug => <li key={drug}>{drug}</li>)}
              </ul>
            </CardContent>
          </Card>
           <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Clock/> Dosing & Duration</CardTitle></CardHeader>
            <CardContent><p>{result.dosingAndDuration}</p></CardContent>
          </Card>
          <Card className="border-primary bg-primary/5">
            <CardHeader><CardTitle className="flex items-center gap-2 text-primary"><AlertTriangle/> Important Considerations</CardTitle></CardHeader>
            <CardContent><p>{result.importantConsiderations}</p></CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
