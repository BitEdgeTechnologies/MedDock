"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlusCircle, Trash2, Printer, User, HeartPulse, Pill, ShieldAlert, Users, Stethoscope } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  personalDetails: z.object({
    fullName: z.string().min(1, 'Full name is required.'),
    dob: z.string().min(1, 'Date of birth is required.'),
    gender: z.string().optional(),
  }),
  medicalConditions: z.string().optional(),
  surgeries: z.string().optional(),
  currentMedications: z.array(z.object({
    name: z.string().min(1, 'Medication name is required.'),
    dosage: z.string().min(1, 'Dosage is required.'),
    frequency: z.string().min(1, 'Frequency is required.'),
  })),
  allergies: z.string().optional(),
  familyHistory: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function MedicalHistoryForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalDetails: { fullName: '', dob: '', gender: '' },
      currentMedications: [{ name: '', dosage: '', frequency: '' }],
      allergies: '',
      familyHistory: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "currentMedications"
  });
  
  const onSubmit = (data: FormValues) => {
    // In a real app, you'd save this data. For this demo, we'll just use the print function.
    console.log(data);
    window.print();
  };

  return (
    <div className="mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" id="medical-form-printable-area">
          
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><User /> Personal Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField control={form.control} name="personalDetails.fullName" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="personalDetails.dob" render={({ field }) => (
                  <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><HeartPulse /> Medical History</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 <FormField control={form.control} name="medicalConditions" render={({ field }) => (
                  <FormItem><FormLabel>Past Medical Conditions</FormLabel><FormControl><Textarea placeholder="e.g., Hypertension, Diabetes Type 2, Asthma" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="surgeries" render={({ field }) => (
                  <FormItem><FormLabel>Past Surgeries</FormLabel><FormControl><Textarea placeholder="e.g., Appendectomy (2010), Knee Arthroscopy (2015)" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </CardContent>
          </Card>

           <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Pill /> Current Medications</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                       <FormField control={form.control} name={`currentMedications.${index}.name`} render={({ field }) => (
                          <FormItem className="md:col-span-2"><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`currentMedications.${index}.dosage`} render={({ field }) => (
                          <FormItem><FormLabel>Dosage</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="flex items-center gap-2">
                            <FormField control={form.control} name={`currentMedications.${index}.frequency`} render={({ field }) => (
                              <FormItem className="flex-grow"><FormLabel>Frequency</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                ))}
                 <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', dosage: '', frequency: '' })}>
                    <PlusCircle className="mr-2" /> Add Medication
                </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ShieldAlert /> Allergies</CardTitle></CardHeader>
            <CardContent>
                <FormField control={form.control} name="allergies" render={({ field }) => (
                  <FormItem><FormControl><Textarea placeholder="List all known allergies to medications, food, or other substances (e.g., Penicillin, Peanuts, Latex)" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users /> Family History</CardTitle></CardHeader>
            <CardContent>
                 <FormField control={form.control} name="familyHistory" render={({ field }) => (
                  <FormItem><FormControl><Textarea placeholder="Note any significant medical conditions in your immediate family (parents, siblings), e.g., 'Father had a heart attack at age 55. Mother has high blood pressure.'" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full print-button">
            <Printer className="mr-2" />
            Save & Print
          </Button>
        </form>
      </Form>
      <style jsx global>{`
        @media print {
            body * {
                visibility: hidden;
            }
            #medical-form-printable-area, #medical-form-printable-area * {
                visibility: visible;
            }
            #medical-form-printable-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            .print-button {
                display: none !important;
            }
            input, textarea {
                border: 1px solid #ccc !important;
            }
        }
      `}</style>
    </div>
  );
}
