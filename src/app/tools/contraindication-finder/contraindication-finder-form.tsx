"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  findContraindications,
  type ContraindicationFinderOutput,
} from '@/ai/flows/contraindication-finder-flow';
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
import { Loader2, Search, ShieldBan } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  drugName: z.string().min(2, 'Please enter a drug name.'),
  condition: z.string().optional(),
});

export function ContraindicationFinderForm() {
  const [result, setResult] = useState<ContraindicationFinderOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugName: '',
      condition: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const apiResult = await findContraindications(values);
      setResult(apiResult);
    } catch (error) {
      console.error('Error finding contraindications:', error);
      toast({
        title: 'An Error Occurred',
        description: 'Failed to retrieve information. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getSeverityBadgeVariant = (severity: 'Absolute' | 'Relative' | 'Warning') => {
    switch (severity) {
      case 'Absolute': return 'destructive';
      case 'Relative': return 'secondary';
      default: return 'default';
    }
  }

  return (
    <div className="mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="drugName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-lg">Drug Name</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g., 'Sildenafil'" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-lg">Medical Condition (Optional)</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g., 'Cardiovascular Disease'" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Find Contraindications
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
                <ShieldBan className="text-primary"/>
                Results for {result.drugName}
            </h2>
            {result.contraindications.length > 0 ? (
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {result.contraindications.map((item, index) => (
                        <Card key={item.contraindication}>
                            <AccordionItem value={`item-${index}`} className="border-b-0">
                                <AccordionTrigger className="p-6 text-left">
                                    <div className="flex justify-between items-center w-full">
                                        <CardTitle className="text-lg">{item.contraindication}</CardTitle>
                                        <Badge variant={getSeverityBadgeVariant(item.severity)}>{item.severity}</Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6">
                                    <p className="text-muted-foreground">{item.explanation}</p>
                                </AccordionContent>
                            </AccordionItem>
                        </Card>
                    ))}
                </Accordion>
            ) : (
                 <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                        No specific contraindications found based on the provided information. Always consult official drug monographs and exercise clinical judgment.
                    </CardContent>
                </Card>
            )}
        </div>
      )}
    </div>
  );
}
