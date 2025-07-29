"use client";

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  checkDrugInteractions,
  type DrugInteractionOutput,
} from '@/ai/flows/drug-interaction-checker-flow';
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
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, PlusCircle, Trash2, Loader2, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  drugs: z.array(z.object({ name: z.string().min(1, 'Drug name cannot be empty.') })).min(2, 'Please enter at least two drugs.'),
});

export function DrugInteractionCheckerForm() {
  const [result, setResult] = useState<DrugInteractionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugs: [{ name: '' }, { name: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "drugs"
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const interactionResult = await checkDrugInteractions({ drugs: values.drugs.map(d => d.name) });
      setResult(interactionResult);
    } catch (error) {
      console.error('Error checking drug interactions:', error);
      toast({
        title: 'An Error Occurred',
        description: 'Failed to check for interactions. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getSeverityBadgeVariant = (severity: 'Mild' | 'Moderate' | 'Severe') => {
    switch (severity) {
      case 'Severe': return 'destructive';
      case 'Moderate': return 'secondary';
      default: return 'default';
    }
  }

  return (
    <div className="mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`drugs.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={index === 0 ? 'text-lg' : 'sr-only'}>
                      {index === 0 ? 'Drugs' : `Drug ${index + 1}`}
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input placeholder={`e.g., 'Lisinopril'`} {...field} />
                      </FormControl>
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 2}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="button" variant="outline" onClick={() => append({ name: '' })}>
              <PlusCircle className="mr-2" />
              Add Another Drug
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="animate-spin" /> Checking...</>
            ) : (
              <><AlertTriangle /> Check for Interactions</>
            )}
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-10 space-y-6">
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Info/> Summary</CardTitle></CardHeader>
            <CardContent><p>{result.interactionSummary}</p></CardContent>
          </Card>

          {result.interactions.map((interaction, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{interaction.drugA} & {interaction.drugB}</span>
                  <Badge variant={getSeverityBadgeVariant(interaction.severity)}>{interaction.severity}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent><p>{interaction.description}</p></CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
