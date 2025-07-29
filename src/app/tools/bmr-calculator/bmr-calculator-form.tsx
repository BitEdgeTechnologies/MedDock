
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Flame } from 'lucide-react';

const formSchema = z.object({
  age: z.coerce.number().int().positive('Age must be a positive integer.'),
  gender: z.enum(['male', 'female'], { required_error: 'Please select a gender.' }),
  height: z.coerce.number().positive('Height must be positive.'),
  weight: z.coerce.number().positive('Weight must be positive.'),
});

export function BmrCalculatorForm() {
  const [bmrResult, setBmrResult] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: '' as any,
      height: '' as any,
      weight: '' as any,
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Mifflin-St Jeor Equation
    let bmr;
    if (values.gender === 'male') {
      bmr = 10 * values.weight + 6.25 * values.height - 5 * values.age + 5;
    } else {
      bmr = 10 * values.weight + 6.25 * values.height - 5 * values.age - 161;
    }
    setBmrResult(bmr);
  }

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Enter Your Details (Metric)</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (years)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="male" /></FormControl><FormLabel>Male</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="female" /></FormControl><FormLabel>Female</FormLabel></FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Calculate BMR</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {bmrResult && (
        <Card className="mt-6">
          <CardHeader className="text-center">
            <CardTitle>Your BMR Result</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <Flame className="mx-auto h-16 w-16 text-primary" />
            <p className="text-4xl font-bold">{bmrResult.toFixed(0)}</p>
            <p className="text-muted-foreground">Calories/day</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
