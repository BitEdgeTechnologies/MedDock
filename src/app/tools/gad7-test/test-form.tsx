"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
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
  FormMessage,
} from '@/components/ui/form';
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Check, Info, ShieldQuestion } from 'lucide-react';

const questions = [
    { name: "nervous", label: "Feeling nervous, anxious, or on edge" },
    { name: "worrying", label: "Not being able to stop or control worrying" },
    { name: "worryingTooMuch", label: "Worrying too much about different things" },
    { name: "relaxing", label: "Trouble relaxing" },
    { name: "restless", label: "Being so restless that it is hard to sit still" },
    { name: "annoyed", label: "Becoming easily annoyed or irritable" },
    { name: "afraid", label: "Feeling afraid as if something awful might happen" },
];

const formSchema = z.object(Object.fromEntries(
    questions.map(q => [q.name, z.string({ required_error: 'Please select an option.' })])
));

export function Gad7TestForm() {
    const [score, setScore] = useState<number | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        const totalScore = Object.values(data).reduce((sum, value) => sum + parseInt(value, 10), 0);
        setScore(totalScore);
    }
    
    const getInterpretation = (score: number) => {
        if (score <= 4) return { severity: "Minimal anxiety", color: "text-green-500" };
        if (score <= 9) return { severity: "Mild anxiety", color: "text-yellow-500" };
        if (score <= 14) return { severity: "Moderate anxiety", color: "text-orange-500" };
        return { severity: "Severe anxiety", color: "text-red-500" };
    };
    
    const interpretation = score !== null ? getInterpretation(score) : null;

    return (
    <div className="mt-8">
        {score === null ? (
            <Card>
                <CardHeader>
                    <CardTitle>Over the last 2 weeks, how often have you been bothered by any of the following problems?</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                           {questions.map((q, index) => (
                             <FormField
                                key={q.name}
                                control={form.control}
                                name={q.name as any}
                                render={({ field }) => (
                                    <FormItem className="space-y-3 rounded-md border p-4">
                                        <FormLabel className="font-semibold">{index+1}. {q.label}</FormLabel>
                                         <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                                            >
                                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="0" /></FormControl><FormLabel>Not at all</FormLabel></FormItem>
                                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="1" /></FormControl><FormLabel>Several days</FormLabel></FormItem>
                                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="2" /></FormControl><FormLabel>More than half the days</FormLabel></FormItem>
                                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="3" /></FormControl><FormLabel>Nearly every day</FormLabel></FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                           ))}
                            <Button type="submit">
                                <Check className="mr-2" />
                                Calculate Score
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        ) : (
            <Card>
                <CardHeader>
                    <CardTitle>Your GAD-7 Result</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <ShieldQuestion className={`mx-auto h-16 w-16 ${interpretation?.color}`} />
                    <p className="text-4xl font-bold">{score}</p>
                    <p className={`text-xl font-semibold ${interpretation?.color}`}>{interpretation?.severity}</p>
                     <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Next Steps</AlertTitle>
                        <AlertDescription>
                            A score of 10 or greater suggests a possible diagnosis of generalized anxiety disorder. Further evaluation by a clinician is recommended to confirm.
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={() => { setScore(null); form.reset(); }}>Take the test again</Button>
                </CardFooter>
            </Card>
        )}
    </div>
    )
}
