"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calculator, AlertCircle } from 'lucide-react';

const formSchema = z.object({
  patientWeight: z.coerce.number().positive('Weight must be positive.'),
  weightUnit: z.enum(['kg', 'lb']),
  drugConcentration: z.coerce.number().positive('Concentration must be positive.'),
  concentrationUnit: z.string().min(1, 'Unit is required.'),
  dosage: z.coerce.number().positive('Dosage must be positive.'),
  dosageUnit: z.string().min(1, 'Unit is required.'),
});

export function DosageCalculatorForm() {
  const [result, setResult] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientWeight: '' as any,
      weightUnit: 'kg',
      drugConcentration: '' as any,
      concentrationUnit: 'mg/mL',
      dosage: '' as any,
      dosageUnit: 'mg/kg',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const weightInKg = values.weightUnit === 'kg' ? values.patientWeight : values.patientWeight / 2.20462;
    const totalDose = values.dosage * weightInKg;
    const volumeToAdminister = totalDose / values.drugConcentration;
    
    setResult(
      `Administer ${volumeToAdminister.toFixed(2)} mL.`
    );
  }

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Dosage Calculation</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="patientWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Weight</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 70" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weightUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="lb">lb</SelectItem>
                          </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="drugConcentration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drug Concentration</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="concentrationUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mg/mL">mg/mL</SelectItem>
                            <SelectItem value="mcg/mL">mcg/mL</SelectItem>
                          </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prescribed Dosage</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dosageUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mg/kg">mg/kg</SelectItem>
                            <SelectItem value="mcg/kg">mcg/kg</SelectItem>
                             <SelectItem value="mg/kg/day">mg/kg/day</SelectItem>
                            <SelectItem value="mcg/kg/min">mcg/kg/min</SelectItem>
                          </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Dosage
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
