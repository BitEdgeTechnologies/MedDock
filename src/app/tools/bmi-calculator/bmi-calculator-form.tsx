
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User } from 'lucide-react';

const metricSchema = z.object({
  heightCm: z.coerce.number().positive('Height must be positive.'),
  weightKg: z.coerce.number().positive('Weight must be positive.'),
});

const imperialSchema = z.object({
  heightFt: z.coerce.number().positive('Feet must be positive.'),
  heightIn: z.coerce.number().min(0, 'Inches must be non-negative.').max(11, 'Inches must be less than 12.'),
  weightLb: z.coerce.number().positive('Weight must be positive.'),
});

export function BmiCalculatorForm() {
  const [result, setResult] = useState<{ bmi: number, category: string, color: string } | null>(null);
  const [unitSystem, setUnitSystem] = useState('metric');

  const metricForm = useForm<z.infer<typeof metricSchema>>({
    resolver: zodResolver(metricSchema),
    defaultValues: {
      heightCm: '' as any,
      weightKg: '' as any,
    }
  });

  const imperialForm = useForm<z.infer<typeof imperialSchema>>({
    resolver: zodResolver(imperialSchema),
    defaultValues: { heightFt: '' as any, heightIn: 0, weightLb: '' as any }
  });
  
  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-yellow-500' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-500' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-orange-500' };
    return { category: 'Obesity', color: 'text-red-500' };
  };

  const calculateBmi = (values: any) => {
    let bmi;
    if (unitSystem === 'metric') {
      bmi = values.weightKg / ((values.heightCm / 100) ** 2);
    } else {
      const heightInInches = values.heightFt * 12 + values.heightIn;
      bmi = (values.weightLb / (heightInInches ** 2)) * 703;
    }
    setResult({ bmi, ...getBmiCategory(bmi) });
  };


  return (
    <div className="mt-8">
      <Tabs defaultValue="metric" onValueChange={setUnitSystem}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metric">Metric</TabsTrigger>
          <TabsTrigger value="imperial">Imperial</TabsTrigger>
        </TabsList>
        <TabsContent value="metric">
          <Card>
            <CardContent className="pt-6">
              <Form {...metricForm}>
                <form onSubmit={metricForm.handleSubmit(calculateBmi)} className="space-y-6">
                  <FormField control={metricForm.control} name="heightCm" render={({ field }) => (
                    <FormItem><FormLabel>Height (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={metricForm.control} name="weightKg" render={({ field }) => (
                    <FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full">Calculate BMI</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="imperial">
            <Card>
                <CardContent className="pt-6">
                <Form {...imperialForm}>
                    <form onSubmit={imperialForm.handleSubmit(calculateBmi)} className="space-y-6">
                    <FormItem>
                        <FormLabel>Height</FormLabel>
                        <div className="flex gap-2">
                             <FormField control={imperialForm.control} name="heightFt" render={({ field }) => (
                                <FormItem className="flex-1"><FormControl><Input type="number" placeholder="ft" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={imperialForm.control} name="heightIn" render={({ field }) => (
                                <FormItem className="flex-1"><FormControl><Input type="number" placeholder="in" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                    </FormItem>
                    <FormField control={imperialForm.control} name="weightLb" render={({ field }) => (
                        <FormItem><FormLabel>Weight (lb)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit" className="w-full">Calculate BMI</Button>
                    </form>
                </Form>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

      {result && (
        <Card className="mt-6">
          <CardHeader className="text-center">
            <CardTitle>Your BMI Result</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <User className={`mx-auto h-16 w-16 ${result.color}`} />
            <p className="text-4xl font-bold">{result.bmi.toFixed(1)}</p>
            <p className={`text-xl font-semibold ${result.color}`}>{result.category}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
