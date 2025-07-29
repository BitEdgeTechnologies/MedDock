"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  analyzeLabReport,
  type LabReportAnalyzerOutput,
} from '@/ai/flows/lab-report-analyzer-flow';
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
import { TestTubeDiagonal, ListChecks, Lightbulb, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  reportText: z.string().min(50, {
    message: 'Please paste the full lab report (at least 50 characters).',
  }),
});

export function LabReportAnalyzerForm() {
  const [result, setResult] = useState<LabReportAnalyzerOutput | null>(null);
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
      const analysisResult = await analyzeLabReport(values);
      setResult(analysisResult);
    } catch (error) {
      console.error('Error analyzing lab report:', error);
      toast({
        title: 'An Error Occurred',
        description: 'Failed to analyze the report. Please try again later.',
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
                <FormLabel className="text-lg">Full Lab Report</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste the entire text of the lab report here..."
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
                Analyzing Report...
              </>
            ) : (
              <>
                <TestTubeDiagonal className="mr-2 h-4 w-4" />
                Analyze Report
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
                <TestTubeDiagonal className="h-5 w-5" />
                Overall Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90">{result.overallAssessment}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                Significant Findings
              </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                    {result.significantFindings.map(finding => <li key={finding}>{finding}</li>)}
                </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Potential Implications & Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90">{result.potentialImplications}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
