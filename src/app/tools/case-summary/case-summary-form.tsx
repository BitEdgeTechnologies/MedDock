"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateCaseSummary,
  type CaseSummaryGeneratorOutput,
} from '@/ai/flows/case-summary-generator-flow';
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
import { FileText, Loader2, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  notes: z.string().min(50, {
    message: 'Please enter at least 50 characters of clinical notes.',
  }),
});

export function CaseSummaryForm() {
  const [result, setResult] = useState<CaseSummaryGeneratorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const summaryResult = await generateCaseSummary(values);
      setResult(summaryResult);
    } catch (error) {
      console.error('Error generating case summary:', error);
      toast({
        title: 'An Error Occurred',
        description: 'Failed to generate the summary. Please try again later.',
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
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Clinical Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste your unstructured clinical notes, patient history, and findings here..."
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
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Summary
              </>
            )}
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-10">
            <Skeleton className="h-64 w-full" />
        </div>
      )}

      {result && (
        <div className="mt-10">
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Case Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-sans text-sm">{result.summary}</pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
