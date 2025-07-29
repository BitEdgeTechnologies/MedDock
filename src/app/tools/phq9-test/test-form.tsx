"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Check, Frown, Meh, Smile, SmilePlus, Info } from 'lucide-react';

const questions = [
    { name: "interest", label: "Little interest or pleasure in doing things" },
    { name: "feeling", label: "Feeling down, depressed, or hopeless" },
    { name: "sleep", label: "Trouble falling or staying asleep, or sleeping too much" },
    { name: "energy", label: "Feeling tired or having little energy" },
    { name: "appetite", label: "Poor appetite or overeating" },
    { name: "selfEsteem", label: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down" },
    { name: "concentration", label: "Trouble concentrating on things, such as reading the newspaper or watching television" },
    { name: "slowness", label: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual" },
    { name: "suicidal", label: "Thoughts that you would be better off dead or of hurting yourself in some way" },
];

const formSchema = z.object(Object.fromEntries(
    questions.map(q => [q.name, z.string({ required_error: 'Please select an option.' })])
));

export function Phq9TestForm() {
    const [score, setScore] = useState<number | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        const totalScore = Object.values(data).reduce((sum, value) => sum + parseInt(value, 10), 0);
        setScore(totalScore);
    }
    
    const getInterpretation = (score: number) => {
        if (score <= 4) return { severity: "Minimal depression", recommendation: "No action needed.", icon: Smile, color: "text-green-500" };
        if (score <= 9) return { severity: "Mild depression", recommendation: "Watchful waiting; repeat PHQ-9 at follow-up.", icon: SmilePlus, color: "text-yellow-500" };
        if (score <= 14) return { severity: "Moderate depression", recommendation: "Consider counseling, follow-up and/or pharmacotherapy.", icon: Meh, color: "text-orange-500" };
        if (score <= 19) return { severity: "Moderately severe depression", recommendation: "Active treatment with pharmacotherapy and/or psychotherapy.", icon: Frown, color: "text-red-500" };
        return { severity: "Severe depression", recommendation: "Immediate initiation of pharmacotherapy and, if severe, consider hospitalization.", icon: Frown, color: "text-red-600" };
    };
    
    const interpretation = score !== null ? getInterpretation(score) : null;
    const Icon = interpretation?.icon;

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
                    <CardTitle>Your PHQ-9 Result</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    {Icon && <Icon className={`mx-auto h-16 w-16 ${interpretation?.color}`} />}
                    <p className="text-4xl font-bold">{score}</p>
                    <p className="text-xl font-semibold">{interpretation?.severity}</p>
                     <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Recommendation</AlertTitle>
                        <AlertDescription>{interpretation?.recommendation}</AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={() => setScore(null)}>Take the test again</Button>
                </CardFooter>
            </Card>
        )}
    </div>
    )
}
