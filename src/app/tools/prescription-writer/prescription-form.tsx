"use client";

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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlusCircle, Trash2, Printer, Stethoscope, User, Pill } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  doctorName: z.string().min(1, 'Doctor name is required'),
  clinicName: z.string().min(1, 'Clinic/Hospital name is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  patientAge: z.coerce.number().positive('Age must be a positive number'),
  date: z.string(),
  medications: z.array(z.object({
    name: z.string().min(1, 'Drug name is required'),
    dosage: z.string().min(1, 'Dosage is required'),
    frequency: z.string().min(1, 'Frequency is required'),
  })).min(1, 'At least one medication is required'),
  advice: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function PrescriptionForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctorName: '',
      clinicName: '',
      patientName: '',
      patientAge: '' as any,
      date: format(new Date(), 'yyyy-MM-dd'),
      medications: [{ name: '', dosage: '', frequency: '' }],
      advice: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medications"
  });
  
  const onSubmit = (data: FormValues) => {
    // In a real app, you might save this data. For this demo, we'll just trigger print.
    console.log(data);
    window.print();
  };

  return (
    <>
      <div className="mt-8 p-4 md:p-8 rounded-lg border bg-card text-card-foreground shadow-sm print:shadow-none print:border-none print:p-0" id="prescription-printable-area">
          {/* Header */}
          <div className="flex flex-col items-center text-center border-b pb-4">
              <h1 className="text-3xl font-bold font-headline">{form.watch('doctorName') || 'Dr. Name'}</h1>
              <p className="text-lg">{form.watch('clinicName') || 'Clinic / Hospital Name'}</p>
          </div>
          
          {/* Patient Info */}
          <div className="grid grid-cols-2 gap-4 mt-4 border-b pb-4">
              <div><strong>Patient:</strong> {form.watch('patientName') || 'Patient Name'}</div>
              <div className="text-right"><strong>Age:</strong> {form.watch('patientAge') || 'Patient Age'}</div>
              <div className="col-span-2 text-right"><strong>Date:</strong> {form.watch('date') ? format(new Date(form.watch('date')), 'PPP') : ''}</div>
          </div>

          {/* Rx Symbol and Medications */}
          <div className="mt-6">
            <div className="flex items-start">
              <span className="text-5xl font-serif mr-4">℞</span>
              <div className="w-full">
                {form.watch('medications').map((med, index) => (
                    <div key={index} className="mb-4">
                        <p className="font-bold text-lg">{med.name || `Medication #${index + 1}`}</p>
                        <p className="pl-4">{med.dosage} - {med.frequency}</p>
                    </div>
                ))}
              </div>
            </div>
          </div>
          
           {/* Advice */}
          {form.watch('advice') && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-bold mb-2">Advice:</h3>
              <p className="whitespace-pre-wrap">{form.watch('advice')}</p>
            </div>
          )}

           {/* Signature */}
          <div className="mt-20 text-right">
              <div className="inline-block">
                <div className="border-t-2 border-black w-48 mt-1"></div>
                <p>Signature</p>
              </div>
          </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-8 print:hidden">
           <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Stethoscope/> Clinician Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField control={form.control} name="doctorName" render={({ field }) => (
                  <FormItem><FormLabel>Doctor's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="clinicName" render={({ field }) => (
                  <FormItem><FormLabel>Clinic/Hospital Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </CardContent>
          </Card>

           <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><User /> Patient Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <FormField control={form.control} name="patientName" render={({ field }) => (
                  <FormItem><FormLabel>Patient's Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="patientAge" render={({ field }) => (
                  <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </CardContent>
          </Card>

           <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Pill /> Medications</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-7 gap-2 items-end">
                       <FormField control={form.control} name={`medications.${index}.name`} render={({ field }) => (
                          <FormItem className="md:col-span-3"><FormLabel>Drug Name</FormLabel><FormControl><Input placeholder="e.g., Amoxicillin" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`medications.${index}.dosage`} render={({ field }) => (
                          <FormItem className="md:col-span-2"><FormLabel>Dosage</FormLabel><FormControl><Input placeholder="e.g., 500mg" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="flex items-center gap-2 md:col-span-2">
                            <FormField control={form.control} name={`medications.${index}.frequency`} render={({ field }) => (
                              <FormItem className="flex-grow"><FormLabel>Frequency</FormLabel><FormControl><Input placeholder="e.g., 1 tab TID" {...field} /></FormControl><FormMessage /></FormItem>
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
            <CardHeader><CardTitle className="flex items-center gap-2">Advice</CardTitle></CardHeader>
            <CardContent>
                 <FormField control={form.control} name="advice" render={({ field }) => (
                  <FormItem><FormLabel>Additional Advice</FormLabel><FormControl><Textarea placeholder="e.g., Bed rest for 3 days, drink plenty of fluids." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            <Printer className="mr-2" />
            Save & Print Prescription
          </Button>
        </form>
      </Form>
      <style jsx global>{`
        @media print {
            body * {
                visibility: hidden;
            }
            #prescription-printable-area, #prescription-printable-area * {
                visibility: visible;
            }
            #prescription-printable-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
        }
      `}</style>
    </>
  );
}
