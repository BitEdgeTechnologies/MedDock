"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateDdx,
  type DdxGeneratorOutput,
} from '@/ai/flows/ddx-generator-flow';
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
import { Loader2, Share2, Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
  findings: z.string().min(20, {
    message: 'Please enter at least 20 characters of clinical findings.',
  }),
});

export function DdxGeneratorForm() {
  const [result, setResult] = useState<DdxGeneratorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      findings: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const ddxResult = await generateDdx(values);
      setResult(ddxResult);
    } catch (error) {
      console.error('Error generating differential diagnosis:', error);
      toast({
        title: 'An Error Occurred',
        description: 'Failed to generate the DDx. Please try again later.',
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
            name="findings"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Clinical Findings</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter symptoms, signs, patient history, and initial lab results..."
                    className="min-h-[200px] resize-y"
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
                <Share2 className="mr-2 h-4 w-4" />
                Generate DDx
              </>
            )}
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-10 space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-4">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
                <Lightbulb className="text-primary"/>
                Potential Diagnoses
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
                {result.differentials.map((item, index) => (
                    <Card key={item.condition}>
                        <AccordionItem value={`item-${index}`} className="border-b-0">
                             <AccordionTrigger className="p-6 text-left">
                                <CardTitle className="text-lg">{index + 1}. {item.condition}</CardTitle>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                                <p className="text-muted-foreground">{item.reasoning}</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Card>
                ))}
            </Accordion>
        </div>
      )}
    </div>
  );
}
