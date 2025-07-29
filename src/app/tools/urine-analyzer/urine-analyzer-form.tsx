
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  analyzeUrineReport,
  type UrineAnalyzerOutput,
} from '@/ai/flows/urine-analyzer-flow';
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
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FlaskConical, Lightbulb, Loader2, Info, Stethoscope } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  reportText: z.string().min(20, {
    message: 'Please paste the urinalysis report (at least 20 characters).',
  }),
});

export function UrineAnalyzerForm() {
  const [result, setResult] = useState<UrineAnalyzerOutput | null>(null);
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
      const analysisResult = await analyzeUrineReport(values);
      setResult(analysisResult);
    } catch (error) {
      console.error('Error analyzing urine report:', error);
      toast({
        title: 'An Error Occurred',
        description: 'Failed to analyze the report. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
    const getFindingBadgeVariant = (finding: 'Normal' | 'Abnormal' | 'Trace') => {
    switch (finding) {
      case 'Abnormal': return 'destructive';
      case 'Trace': return 'secondary';
      default: return 'default';
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
                <FormLabel className="text-lg">Urinalysis Report Text</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Color: Yellow, Clarity: Clear, pH: 6.0, Glucose: Negative..."
                    className="min-h-[200px] resize-y font-mono"
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
                <FlaskConical className="mr-2 h-4 w-4" />
                Analyze Report
              </>
            )}
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-10 space-y-6">
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Overall Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{result.summary}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Detailed Interpretation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Finding</TableHead>
                    <TableHead>Comment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.interpretation.map((item) => (
                    <TableRow key={item.parameter}>
                      <TableCell className="font-medium">{item.parameter}</TableCell>
                      <TableCell>{item.value}</TableCell>
                      <TableCell><Badge variant={getFindingBadgeVariant(item.finding)}>{item.finding}</Badge></TableCell>
                      <TableCell>{item.comment}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
           <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Lightbulb className="h-5 w-5" />
                Potential Clinical Implications
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
