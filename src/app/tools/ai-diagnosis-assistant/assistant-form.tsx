"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  aiDiagnosisAssistant,
  type AiDiagnosisAssistantOutput,
} from '@/ai/flows/ai-diagnosis-assistant';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BrainCircuit, Lightbulb, Loader2, Stethoscope } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  symptoms: z.string().min(10, {
    message: 'Please describe your symptoms in at least 10 characters.',
  }),
});

export function AssistantForm() {
  const [result, setResult] = useState<AiDiagnosisAssistantOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const diagnosisResult = await aiDiagnosisAssistant(values);
      setResult(diagnosisResult);
    } catch (error) {
      console.error('Error getting AI diagnosis:', error);
      toast({
        title: 'An Error Occurred',
        description:
          'Failed to get a diagnosis. Please try again later.',
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
            name="symptoms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Symptoms</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 'Persistent headache for 3 days, sensitivity to light, and mild nausea...'"
                    className="min-h-[120px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <BrainCircuit className="mr-2 h-4 w-4" />
                Get AI Diagnosis
              </>
            )}
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-10 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-muted-foreground">
                <Stethoscope className="h-5 w-5" />
                <Skeleton className="h-6 w-48" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-muted-foreground">
                <Lightbulb className="h-5 w-5" />
                <Skeleton className="h-6 w-40" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-6">
           <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Stethoscope className="h-5 w-5" />
                Preliminary Diagnosis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90">{result.diagnosis}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Potential Causes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90">{result.potentialCauses}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
