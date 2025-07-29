
"use client";

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Eye, RefreshCw, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const testPlates = [
  { id: 1, imageUrl: 'https://placehold.co/400x400.png', dataAiHint: "ishihara plate", correctAnswer: '12', options: ['12', '7', '4', 'None'] },
  { id: 2, imageUrl: 'https://placehold.co/400x400.png', dataAiHint: "ishihara plate", correctAnswer: '8', options: ['3', '8', '5', 'None'] },
  { id: 3, imageUrl: 'https://placehold.co/400x400.png', dataAiHint: "ishihara plate", correctAnswer: '29', options: ['70', '29', '2', 'None'] },
  { id: 4, imageUrl: 'https://placehold.co/400x400.png', dataAiHint: "ishihara plate", correctAnswer: '5', options: ['2', '5', '3', 'None'] },
  { id: 5, imageUrl: 'https://placehold.co/400x400.png', dataAiHint: "ishihara plate", correctAnswer: '74', options: ['21', '74', '7', 'None'] },
  { id: 6, imageUrl: 'https://placehold.co/400x400.png', dataAiHint: "ishihara plate", correctAnswer: 'None', options: ['45', '7', '5', 'None'] },
];

export function ColorBlindnessTest() {
  const [currentPlateIndex, setCurrentPlateIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentPlateIndex] = answer;
    setAnswers(newAnswers);

    if (currentPlateIndex < testPlates.length - 1) {
      setCurrentPlateIndex(currentPlateIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const resetTest = () => {
    setCurrentPlateIndex(0);
    setAnswers([]);
    setIsFinished(false);
  };
  
  const score = answers.reduce((acc, answer, index) => {
      return answer === testPlates[index].correctAnswer ? acc + 1 : acc;
  }, 0);


  return (
    <div className="mt-8">
      <Card>
        {!isFinished ? (
            <>
                <CardHeader>
                    <CardTitle>Plate {currentPlateIndex + 1} of {testPlates.length}</CardTitle>
                    <CardDescription>What number do you see in the image?</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <div className="w-full max-w-[300px] aspect-square rounded-full bg-muted overflow-hidden">
                        <Image
                            src={testPlates[currentPlateIndex].imageUrl}
                            alt={`Ishihara plate ${testPlates[currentPlateIndex].id}`}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover"
                            data-ai-hint={testPlates[currentPlateIndex].dataAiHint}
                        />
                    </div>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-4">
                    {testPlates[currentPlateIndex].options.map(option => (
                        <Button key={option} variant="outline" size="lg" onClick={() => handleAnswer(option)}>
                            {option}
                        </Button>
                    ))}
                </CardFooter>
            </>
        ) : (
            <>
                <CardHeader className="text-center">
                    <CardTitle>Test Complete</CardTitle>
                    <CardDescription>You scored {score} out of {testPlates.length} correctly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <Alert variant={score > 4 ? "default" : "destructive"}>
                        <Eye className="h-4 w-4"/>
                        <AlertTitle>Interpretation</AlertTitle>
                        <AlertDescription>
                          {score > 4 
                            ? "Your answers suggest normal color vision." 
                            : "Your answers suggest a potential color vision deficiency. It is recommended to consult with an optometrist or ophthalmologist for a comprehensive examination."}
                        </AlertDescription>
                   </Alert>
                    <div>
                        <h3 className="font-semibold mb-2">Your Answers:</h3>
                        <ul className="space-y-2">
                            {testPlates.map((plate, index) => (
                                <li key={plate.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                                    <span>Plate {index + 1} (Correct: {plate.correctAnswer})</span>
                                    <div className="flex items-center gap-2">
                                        <span>Your answer: {answers[index]}</span>
                                        {answers[index] === plate.correctAnswer 
                                            ? <CheckCircle className="h-5 w-5 text-green-500" />
                                            : <XCircle className="h-5 w-5 text-red-500" />
                                        }
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={resetTest}>
                        <RefreshCw className="mr-2"/>
                        Take Test Again
                    </Button>
                </CardFooter>
            </>
        )}
      </Card>
    </div>
  );
}
