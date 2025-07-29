"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { BrainCircuit, Calculator, ShieldCheck } from 'lucide-react';

const formSchema = z.object({
  orientationTime: z.array(z.string()).max(5),
  orientationPlace: z.array(z.string()).max(5),
  registration: z.coerce.number().min(0).max(3),
  attention: z.coerce.number().min(0).max(5),
  recall: z.coerce.number().min(0).max(3),
  naming: z.coerce.number().min(0).max(2),
  repetition: z.coerce.number().min(0).max(1),
  threeStageCommand: z.coerce.number().min(0).max(3),
  reading: z.coerce.number().min(0).max(1),
  writing: z.coerce.number().min(0).max(1),
  copying: z.coerce.number().min(0).max(1),
});

type FormValues = z.infer<typeof formSchema>;

const orientationTimeQuestions = [
    { id: 'year', label: 'Year' },
    { id: 'season', label: 'Season' },
    { id: 'date', label: 'Date' },
    { id: 'day', label: 'Day of week' },
    { id: 'month', label: 'Month' },
];

const orientationPlaceQuestions = [
    { id: 'state', label: 'State' },
    { id: 'county', label: 'County' },
    { id: 'town', label: 'Town/City' },
    { id: 'hospital', label: 'Hospital/Building' },
    { id: 'floor', label: 'Floor' },
];

export function MmseScorerForm() {
    const [score, setScore] = useState<number>(0);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            orientationTime: [],
            orientationPlace: [],
            registration: 0,
            attention: 0,
            recall: 0,
            naming: 0,
            repetition: 0,
            threeStageCommand: 0,
            reading: 0,
            writing: 0,
            copying: 0,
        },
    });

    const watchedFields = form.watch();

    useEffect(() => {
        const calculateScore = () => {
            const values = form.getValues();
            let total = 0;
            total += values.orientationTime.length;
            total += values.orientationPlace.length;
            total += values.registration;
            total += values.attention;
            total += values.recall;
            total += values.naming;
            total += values.repetition;
            total += values.threeStageCommand;
            total += values.reading;
            total += values.writing;
            total += values.copying;
            setScore(total);
        };
        calculateScore();
    }, [watchedFields, form]);
    
    const getInterpretation = (score: number) => {
        if (score >= 25) return { severity: "Normal Cognition", color: "text-green-500" };
        if (score >= 21) return { severity: "Mild Cognitive Impairment", color: "text-yellow-500" };
        if (score >= 10) return { severity: "Moderate Cognitive Impairment", color: "text-orange-500" };
        return { severity: "Severe Cognitive Impairment", color: "text-red-500" };
    };
    
    const interpretation = getInterpretation(score);

    const radioField = (name: keyof FormValues, label: string, max: number, description?: string) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-3 rounded-md border p-4">
                    <FormLabel className="font-semibold">{label}</FormLabel>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                    <FormControl>
                        <RadioGroup
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={String(field.value)}
                            className="flex flex-wrap gap-4"
                        >
                           {[...Array(max + 1).keys()].map(i => (
                               <FormItem key={i} className="flex items-center space-x-2 space-y-0">
                                   <FormControl><RadioGroupItem value={String(i)} /></FormControl>
                                   <FormLabel>{i}</FormLabel>
                               </FormItem>
                           ))}
                        </RadioGroup>
                    </FormControl>
                </FormItem>
            )}
        />
    );
    
    const singleCheckboxField = (name: keyof FormValues, label: string, description: string) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                         <Checkbox
                            checked={field.value === 1}
                            onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel className="font-semibold">{label}</FormLabel>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                </FormItem>
            )}
        />
    );

    return (
    <div className="mt-8">
        <Form {...form}>
            <form className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
               <div className="lg:col-span-2 space-y-6">
                 {/* Orientation */}
                <Card>
                    <CardHeader><CardTitle>Orientation (10 points)</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                         <FormField control={form.control} name="orientationTime" render={() => (
                            <FormItem><FormLabel className="font-semibold">Time</FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                               {orientationTimeQuestions.map((item) => (
                                <FormField key={item.id} control={form.control} name="orientationTime"
                                    render={({ field }) => (
                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                        <Checkbox checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                                return checked
                                                ? field.onChange([...(field.value || []), item.id])
                                                : field.onChange(field.value?.filter((value) => value !== item.id))
                                            }}
                                        />
                                        </FormControl>
                                        <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                    )}
                                />
                               ))}
                            </div></FormItem>
                          )}/>
                          <FormField control={form.control} name="orientationPlace" render={() => (
                            <FormItem><FormLabel className="font-semibold">Place</FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                               {orientationPlaceQuestions.map((item) => (
                                <FormField key={item.id} control={form.control} name="orientationPlace"
                                    render={({ field }) => (
                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                        <Checkbox checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                                return checked
                                                ? field.onChange([...(field.value || []), item.id])
                                                : field.onChange(field.value?.filter((value) => value !== item.id))
                                            }}
                                        />
                                        </FormControl>
                                        <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                    )}
                                />
                               ))}
                            </div></FormItem>
                          )}/>
                    </CardContent>
                </Card>
                {/* Registration */}
                <Card>
                    <CardHeader><CardTitle>Registration (3 points)</CardTitle></CardHeader>
                    <CardContent>{radioField("registration", "Name 3 objects", 3, "Ask the patient to repeat them. Score 1 point for each correct repetition.")}</CardContent>
                </Card>
                 {/* Attention and Calculation */}
                <Card>
                    <CardHeader><CardTitle>Attention and Calculation (5 points)</CardTitle></CardHeader>
                    <CardContent>{radioField("attention", "Serial 7s or WORLD backwards", 5, "Ask the patient to subtract 7 from 100, five times, OR spell 'WORLD' backwards. Score 1 point for each correct answer.")}</CardContent>
                </Card>
                {/* Recall */}
                <Card>
                    <CardHeader><CardTitle>Recall (3 points)</CardTitle></CardHeader>
                    <CardContent>{radioField("recall", "Recall 3 objects", 3, "Ask the patient to recall the 3 objects from the registration task.")}</CardContent>
                </Card>
                 {/* Language */}
                <Card>
                    <CardHeader><CardTitle>Language (9 points)</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {radioField("naming", "Naming", 2, "Show two objects (e.g., a pencil and a watch) and ask the patient to name them.")}
                        {singleCheckboxField("repetition", "Repetition", `Ask the patient to repeat the phrase: "No ifs, ands, or buts."`)}
                        {radioField("threeStageCommand", "3-Stage Command", 3, `Give the command: "Take a paper in your right hand, fold it in half, and put it on the floor."`)}
                        {singleCheckboxField("reading", "Reading", `On a piece of paper, write "CLOSE YOUR EYES" and ask the patient to read and do it.`)}
                        {singleCheckboxField("writing", "Writing", `Ask the patient to write a sentence. It must be spontaneous and contain a subject and a verb.`)}
                        {singleCheckboxField("copying", "Copying", `Ask the patient to copy a complex geometric figure (e.g., two intersecting pentagons).`)}
                    </CardContent>
                </Card>

               </div>

                <div className="lg:col-span-1 space-y-6 sticky top-24">
                   <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calculator />
                                Total Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-6xl font-bold">{score} <span className="text-3xl text-muted-foreground">/ 30</span></p>
                        </CardContent>
                        <CardFooter>
                             <Button onClick={() => form.reset()} variant="outline" className="w-full">Reset Form</Button>
                        </CardFooter>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BrainCircuit />
                                Interpretation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                             <p className={`text-xl font-semibold ${interpretation.color}`}>{interpretation.severity}</p>
                             <Alert className="mt-4 text-left">
                                <ShieldCheck className="h-4 w-4" />
                                <AlertTitle>Guideline</AlertTitle>
                                <AlertDescription>
                                    <ul>
                                        <li><strong>25-30:</strong> Normal Cognition</li>
                                        <li><strong>21-24:</strong> Mild Impairment</li>
                                        <li><strong>10-20:</strong> Moderate Impairment</li>
                                        <li><strong>&lt;10:</strong> Severe Impairment</li>
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </Form>
    </div>
    )
}
