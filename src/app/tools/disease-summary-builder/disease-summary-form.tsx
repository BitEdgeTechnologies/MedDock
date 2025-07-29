"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  getDiseaseSummary,
  type DiseaseSummaryOutput,
} from '@/ai/flows/disease-summary-flow';
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
import { Stethoscope, Dna, Activity, Search, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
  disease: z.string().min(3, {
    message: 'Please enter a disease name.',
  }),
});

export function DiseaseSummaryForm() {
  const [result, setResult] = useState<DiseaseSummaryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      disease: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const summaryResult = await getDiseaseSummary(values);
      setResult(summaryResult);
    } catch (error) {
      console.error('Error getting disease summary:', error);
      toast({
        title: 'An Error Occurred',
        description: 'Failed to retrieve summary. Please try again later.',
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
            name="disease"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Disease or Condition</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 'Myocardial Infarction'" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="animate-spin" /> Generating...</>
            ) : (
                <>
                    <Search className="mr-2"/>
                    Generate Summary
                </>
            )}
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-10 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>{result.diseaseName}</CardTitle>
                <CardContent className="p-0 pt-2 text-muted-foreground">{result.overview}</CardContent>
            </CardHeader>
          </Card>
          <Accordion type="multiple" className="w-full space-y-4" defaultValue={['pathophysiology', 'symptoms', 'diagnosis', 'treatment']}>
            <Card>
                <AccordionItem value="pathophysiology" className="border-b-0">
                    <AccordionTrigger className="p-6">
                        <CardTitle className="flex items-center gap-2 text-base"><Dna/> Pathophysiology</CardTitle>
                    </AccordionTrigger>
                    <AccordionContent className="px-6">
                        <p className="text-muted-foreground">{result.pathophysiology}</p>
                    </AccordionContent>
                </AccordionItem>
            </Card>
            <Card>
                <AccordionItem value="symptoms" className="border-b-0">
                    <AccordionTrigger className="p-6">
                        <CardTitle className="flex items-center gap-2 text-base"><Activity/> Signs & Symptoms</CardTitle>
                    </AccordionTrigger>
                    <AccordionContent className="px-6">
                        <p className="text-muted-foreground">{result.signsAndSymptoms}</p>
                    </AccordionContent>
                </AccordionItem>
            </Card>
             <Card>
                <AccordionItem value="diagnosis" className="border-b-0">
                    <AccordionTrigger className="p-6">
                        <CardTitle className="flex items-center gap-2 text-base"><Stethoscope/> Diagnosis</CardTitle>
                    </AccordionTrigger>
                    <AccordionContent className="px-6">
                        <p className="text-muted-foreground">{result.diagnosis}</p>
                    </AccordionContent>
                </AccordionItem>
            </Card>
            <Card>
                <AccordionItem value="treatment" className="border-b-0">
                    <AccordionTrigger className="p-6">
                         <CardTitle className="flex items-center gap-2 text-base"><Stethoscope/> Treatment</CardTitle>
                    </AccordionTrigger>
                    <AccordionContent className="px-6">
                        <p className="text-muted-foreground">{result.treatment}</p>
                    </AccordionContent>
                </AccordionItem>
            </Card>
          </Accordion>
        </div>
      )}
    </div>
  );
}
