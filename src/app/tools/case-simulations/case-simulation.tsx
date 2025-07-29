"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  getCaseSimulation,
  type CaseSimulationOutput,
} from '@/ai/flows/case-simulation-flow';
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
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Lightbulb, RefreshCw, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  topic: z.string().min(3, {
    message: 'Please enter a medical topic.',
  }),
});

export function CaseSimulation() {
  const [caseData, setCaseData] = useState<CaseSimulationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: 'Acute Myocardial Infarction',
    },
  });

  const generateNewCase = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setCaseData(null);
    setSelectedAnswer(null);
    setIsAnswered(false);
    try {
      const result = await getCaseSimulation(values);
      setCaseData(result);
    } catch (error) {
      console.error('Failed to get case simulation', error);
      toast({
        title: 'Error Generating Case',
        description: 'Could not generate a new case. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;
    setIsAnswered(true);
  };
  
  const handleNextCase = () => {
    generateNewCase(form.getValues());
  }

  return (
    <div className="mt-8 space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(generateNewCase)} className="flex items-end gap-2">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormLabel>Case Topic</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 'Acute MI'" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'New Case'}
          </Button>
        </form>
      </Form>
      
      {isLoading && <Skeleton className="h-96 w-full" />}

      {caseData && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText/> Clinical Scenario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground whitespace-pre-wrap">{caseData.scenario}</p>
            
            <div>
              <h3 className="font-semibold mb-2">{caseData.question}</h3>
              <RadioGroup
                value={selectedAnswer ?? ''}
                onValueChange={setSelectedAnswer}
                disabled={isAnswered}
              >
                {caseData.options.map((option, index) => (
                  <FormItem key={index} className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                       <RadioGroupItem value={option} />
                    </FormControl>
                    <FormLabel className="font-normal flex-1 cursor-pointer">
                      {option}
                      {isAnswered && option === caseData.correctAnswer && <CheckCircle className="inline ml-2 text-green-500"/>}
                      {isAnswered && selectedAnswer === option && option !== caseData.correctAnswer && <XCircle className="inline ml-2 text-red-500"/>}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </div>

            {!isAnswered ? (
              <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer} className="w-full">
                Submit Answer
              </Button>
            ) : (
               <Alert className={selectedAnswer === caseData.correctAnswer ? "border-green-500/50" : "border-red-500/50"}>
                <Lightbulb />
                <AlertTitle>Explanation</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap">{caseData.explanation}</AlertDescription>
              </Alert>
            )}

            {isAnswered && (
                <Button onClick={handleNextCase} className="w-full">
                    <RefreshCw/> Next Case
                </Button>
            )}
            
          </CardContent>
        </Card>
      )}

    </div>
  );
}
