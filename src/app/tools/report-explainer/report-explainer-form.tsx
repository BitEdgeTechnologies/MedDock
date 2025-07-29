
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  explainReport,
  type ReportExplainerOutput,
} from '@/ai/flows/report-explainer-flow';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, Lightbulb, ListChecks, Loader2, BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  reportText: z.string().min(50, {
    message: 'Please paste the full lab report (at least 50 characters).',
  }),
});

export function ReportExplainerForm() {
  const [result, setResult] = useState<ReportExplainerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportText: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await explainReport(values);
      setResult(analysisResult);
    } catch (error) {
      console.error('Error explaining lab report:', error);
      toast({
        title: 'An Error Occurred',
        description: 'Failed to explain the report. Please try again later.',
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
            name="reportText"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Paste Your Report Here</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Copy and paste the text from your medical or lab report here..."
                    className="min-h-[250px] resize-y"
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
                Explaining...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Explain My Report
              </>
            )}
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-10 space-y-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-6">
           <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <FileText className="h-5 w-5" />
                Simple Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90">{result.mainSummary}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                Key Findings Explained
              </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                    {result.keyFindings.map((finding, index) => <li key={index}>{finding}</li>)}
                </ul>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Medical Terms Glossary
              </CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {result.glossary.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={item.term}>
                            <AccordionTrigger>{item.term}</AccordionTrigger>
                            <AccordionContent>{item.explanation}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
