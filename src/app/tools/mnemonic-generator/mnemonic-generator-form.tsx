"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateMnemonic,
  type MnemonicGeneratorOutput,
} from '@/ai/flows/mnemonic-generator-flow';
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
import { Lightbulb, Loader2, Wand2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  topic: z.string().min(10, {
    message: 'Please describe the topic in at least 10 characters.',
  }),
});

export function MnemonicGeneratorForm() {
  const [result, setResult] = useState<MnemonicGeneratorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const mnemonicResult = await generateMnemonic(values);
      setResult(mnemonicResult);
    } catch (error) {
      console.error('Error generating mnemonic:', error);
      toast({
        title: 'An Error Occurred',
        description:
          'Failed to generate a mnemonic. Please try again later.',
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
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Medical Topic or List</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 'Cranial Nerves', or 'Causes of pancreatitis: I GET SMASHED'"
                    className="min-h-[120px] resize-none"
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
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Mnemonic
              </>
            )}
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-10 space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-6">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
                <Lightbulb className="text-primary"/>
                Generated Mnemonics
            </h2>
          {result.mnemonics.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{item.mnemonic}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{item.explanation}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
