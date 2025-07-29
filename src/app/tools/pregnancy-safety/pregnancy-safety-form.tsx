"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  checkPregnancySafety,
  type PregnancySafetyOutput,
} from '@/ai/flows/pregnancy-safety-checker-flow';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Search, Baby, Milk, ShieldAlert } from 'lucide-react';

const formSchema = z.object({
  drugName: z.string().min(2, {
    message: 'Please enter a drug name (at least 2 characters).',
  }),
});

export function PregnancySafetyForm() {
  const [result, setResult] = useState<PregnancySafetyOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugName: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const safetyResult = await checkPregnancySafety(values);
      setResult(safetyResult);
    } catch (error) {
      console.error('Error checking pregnancy safety:', error);
      toast({
        title: 'An Error Occurred',
        description: 'Failed to retrieve safety information. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
        case 'A': return 'bg-green-500/20 text-green-700 border-green-500/30';
        case 'B': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
        case 'C': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
        case 'D': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
        case 'X': return 'bg-red-500/20 text-red-700 border-red-500/30';
        default: return 'bg-muted';
    }
  }

  return (
    <div className="mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="drugName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Drug Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 'Amoxicillin'" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Check Safety
              </>
            )}
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-10 space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-6">
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>{result.drugName}</CardTitle>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl font-bold border-2 ${getCategoryColor(result.pregnancyCategory)}`}>
                        {result.pregnancyCategory}
                    </div>
                </CardHeader>
            </Card>

           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="h-5 w-5 text-primary" />
                Pregnancy Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{result.pregnancySummary}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Milk className="h-5 w-5 text-primary" />
                Lactation Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{result.lactationSummary}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
