
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplets } from 'lucide-react';

const formSchema = z.object({
  totalVolume: z.coerce.number().positive('Volume must be positive.'),
  time: z.coerce.number().positive('Time must be positive.'),
  timeUnit: z.enum(['minutes', 'hours']),
  dropFactor: z.coerce.number().positive('Drop factor must be positive.'),
});

export function IvDripRateCalculatorForm() {
  const [result, setResult] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalVolume: '' as any,
      time: '' as any,
      timeUnit: 'hours',
      dropFactor: 15,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const timeInMinutes = values.timeUnit === 'hours' ? values.time * 60 : values.time;
    const dripRate = (values.totalVolume * values.dropFactor) / timeInMinutes;
    setResult(`The drip rate is ${dripRate.toFixed(0)} drops/minute.`);
  }

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>IV Drip Rate Calculation</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="totalVolume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Volume (mL)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 8" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                  control={form.control}
                  name="timeUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Unit</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="minutes">Minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="dropFactor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drop Factor (gtts/mL)</FormLabel>
                     <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="10">10 gtts/mL (Macrodrip)</SelectItem>
                            <SelectItem value="15">15 gtts/mL (Macrodrip)</SelectItem>
                            <SelectItem value="20">20 gtts/mL (Macrodrip)</SelectItem>
                            <SelectItem value="60">60 gtts/mL (Microdrip)</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <Droplets className="mr-2 h-4 w-4" />
                Calculate Drip Rate
              </Button>
            </form>
          </Form>

          {result && (
            <div className="mt-6">
              <Card className="bg-primary/5 border-primary">
                <CardHeader>
                  <CardTitle>Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold text-primary">{result}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
