
"use client"

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { PlusCircle, Trash2, Printer, BookHeart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const entrySchema = z.object({
    date: z.string(),
    mood: z.number().min(1).max(10),
    symptoms: z.string().min(1, 'Please describe your symptoms.'),
    activities: z.string().optional(),
});

const formSchema = z.object({
    entries: z.array(entrySchema),
});

type FormValues = z.infer<typeof formSchema>;

export function HealthDiaryForm() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entries: [
        {
          date: format(new Date(), 'yyyy-MM-dd'),
          mood: 5,
          symptoms: '',
          activities: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "entries"
  });
  
  const onSubmit = (data: FormValues) => {
    // This is just for show as we aren't saving data.
    console.log(data);
    alert("This is a demo. Your data has been logged to the console.");
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="mt-8" id="diary-printable-area">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookHeart /> Health Diary Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 rounded-lg border p-4 relative">
                  <FormField
                    control={form.control}
                    name={`entries.${index}.date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`entries.${index}.mood`}
                    render={({ field: { onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Mood (1 = worst, 10 = best)</FormLabel>
                        <FormControl>
                           <div className="flex items-center gap-4">
                            <Slider
                              min={1}
                              max={10}
                              step={1}
                              defaultValue={[fieldProps.value]}
                              onValueChange={(value) => onChange(value[0])}
                            />
                            <span className="font-bold text-primary w-8 text-center">{fieldProps.value}</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`entries.${index}.symptoms`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symptoms</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Headache, mild nausea, fatigue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`entries.${index}.activities`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activities / Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Went for a walk, took medication at 8am" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {fields.length > 1 && (
                     <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => remove(index)}
                        className="absolute top-2 right-2"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  
                </div>
              ))}
                <Separator />
                <div className="flex justify-between items-center">
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => append({ date: format(new Date(), 'yyyy-MM-dd'), mood: 5, symptoms: '', activities: '' })}
                    >
                        <PlusCircle className="mr-2" />
                        Add New Entry
                    </Button>
                     <Button type="button" onClick={() => window.print()} variant="secondary">
                        <Printer className="mr-2"/>
                        Print Diary
                    </Button>
                </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <style jsx global>{`
        @media print {
            body * {
                visibility: hidden;
            }
            #diary-printable-area, #diary-printable-area * {
                visibility: visible;
            }
            #diary-printable-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            button {
                display: none !important;
            }
            input[type="date"]::-webkit-calendar-picker-indicator {
                display: none;
            }
        }
      `}</style>
    </div>
  );
}
