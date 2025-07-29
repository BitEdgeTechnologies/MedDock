"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  interpretLabResults,
  type LabInterpretationOutput,
} from '@/ai/flows/lab-interpretation-assistant-flow';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Beaker, Lightbulb, Loader2, Info, Stethoscope } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  labType: z.enum(['CBC', 'LFT', 'KFT'], { required_error: 'Please select a lab panel type.' }),
  results: z.string().min(5, {
    message: 'Please enter lab results.',
  }),
});

export function LabInterpretationForm() {
  const [result, setResult] = useState<LabInterpretationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      results: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const interpretationResult = await interpretLabResults(values);
      setResult(interpretationResult);
    } catch (error) {
      console.error('Error interpreting lab results:', error);
      toast({
        title: 'An Error Occurred',
        description:
          'Failed to get an interpretation. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getFindingBadgeVariant = (finding: 'Normal' | 'High' | 'Low' | 'Critical') => {
    switch (finding) {
      case 'Critical': return 'destructive';
      case 'High':
      case 'Low':
        return 'secondary';
      default: return 'default';
    }
  }

  return (
    <div className="mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="labType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Lab Panel</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a lab panel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CBC">Complete Blood Count (CBC)</SelectItem>
                    <SelectItem value="LFT">Liver Function Tests (LFT)</SelectItem>
                    <SelectItem value="KFT">Kidney Function Tests (KFT)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="results"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Results</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter results as key-value pairs. e.g., 'WBC: 12.5, HGB: 10.2, PLT: 150'"
                    className="min-h-[120px] resize-none font-mono"
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
                Interpreting...
              </>
            ) : (
              <>
                <Beaker className="mr-2 h-4 w-4" />
                Interpret Results
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
                Summary
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

          {result.differentials && result.differentials.length > 0 && (
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Potential Differentials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  {result.differentials.map(d => <li key={d}>{d}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
