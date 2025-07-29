"use client";

import { useState, useMemo } from 'react';
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
  getQuizExplanation,
  type QuizExplanationOutput,
} from '@/ai/flows/quiz-explanation-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Lightbulb, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const anatomyQuestions = [
  {
    question: 'Which bone is also known as the "collarbone"?',
    options: ['Scapula', 'Sternum', 'Clavicle', 'Humerus'],
    answer: 'Clavicle',
  },
  {
    question: 'What is the largest organ in the human body?',
    options: ['Liver', 'Brain', 'Skin', 'Heart'],
    answer: 'Skin',
  },
  {
    question: 'Which part of the brain is responsible for balance and coordination?',
    options: ['Cerebrum', 'Cerebellum', 'Medulla Oblongata', 'Pons'],
    answer: 'Cerebellum',
  },
  {
    question: 'The pulmonary artery carries blood from the heart to which organ?',
    options: ['Lungs', 'Liver', 'Kidneys', 'Brain'],
    answer: 'Lungs',
  },
  {
    question: 'Where does the final stage of digestion and nutrient absorption primarily occur?',
    options: ['Stomach', 'Large Intestine', 'Small Intestine', 'Esophagus'],
    answer: 'Small Intestine',
  },
];

type QuizState = 'question' | 'answered' | 'explanation';

export function FlashcardQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('question');
  const [explanation, setExplanation] = useState<QuizExplanationOutput | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentQuestion = useMemo(() => anatomyQuestions[currentIndex], [currentIndex]);
  const isCorrect = selectedAnswer === currentQuestion.answer;

  const handleAnswer = (answer: string) => {
    if (quizState !== 'question') return;
    setSelectedAnswer(answer);
    setIsFlipped(true); // Flip to show the back of the card
    setQuizState('answered');
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setQuizState('question');
        setSelectedAnswer(null);
        setExplanation(null);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % anatomyQuestions.length);
    }, 300) // Wait for flip animation
  };

  const handleGetExplanation = async () => {
    if (!selectedAnswer) return;
    setIsLoadingExplanation(true);
    try {
      const result = await getQuizExplanation({
        question: currentQuestion.question,
        correctAnswer: currentQuestion.answer,
        selectedAnswer: selectedAnswer,
      });
      setExplanation(result);
    } catch (error) {
      console.error('Failed to get explanation', error);
      setExplanation({ explanation: 'Sorry, we couldn\'t load an explanation at this time.' });
    } finally {
      setIsLoadingExplanation(false);
      setQuizState('explanation');
    }
  };
  
  const cardFaceClasses = "absolute inset-0 w-full h-full flex flex-col backface-hidden";

  return (
    <div className="mt-8 space-y-6">
      <div className="perspective-1000">
         <div 
            className={`relative w-full min-h-[350px] transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        >
            {/* Front of the card */}
            <Card className={`${cardFaceClasses} z-10`}>
                <CardHeader>
                    <CardTitle>Anatomy Flashcard</CardTitle>
                    <CardDescription>Question {currentIndex + 1} of {anatomyQuestions.length}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center text-center">
                    <p className="text-xl font-semibold">{currentQuestion.question}</p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    {currentQuestion.options.map((option) => (
                    <Button
                        key={option}
                        variant="outline"
                        className="w-full"
                        onClick={() => handleAnswer(option)}
                        disabled={quizState !== 'question'}
                    >
                        {option}
                    </Button>
                    ))}
                </CardFooter>
            </Card>

            {/* Back of the card */}
            <Card className={`${cardFaceClasses} bg-secondary rotate-y-180`}>
                 <CardHeader>
                    <CardTitle>Result</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
                   <Alert variant={isCorrect ? 'default' : 'destructive'} className="bg-background">
                    <AlertTitle>{isCorrect ? 'Correct!' : 'Incorrect'}</AlertTitle>
                    <AlertDescription>
                        The correct answer is: <strong>{currentQuestion.answer}</strong>
                    </AlertDescription>
                   </Alert>
                    
                    {quizState === 'explanation' && (
                        <Card className="w-full bg-background/50">
                            <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
                                <Lightbulb className="h-5 w-5 text-primary"/>
                                <CardTitle className="text-lg">Explanation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoadingExplanation ? (
                                    <Skeleton className="h-16 w-full" />
                                ) : (
                                    <p className="text-sm text-muted-foreground">{explanation?.explanation}</p>
                                )}
                            </CardContent>
                        </Card>
                    )}

                </CardContent>
                 <CardFooter className="flex flex-col sm:flex-row gap-2">
                    {quizState === 'answered' && (
                        <Button onClick={handleGetExplanation} disabled={isLoadingExplanation} className="w-full">
                            {isLoadingExplanation ? <Loader2 className="animate-spin" /> : <><Lightbulb/> Get AI Explanation</>}
                        </Button>
                    )}
                    <Button onClick={handleNext} className="w-full" variant="secondary">
                       <RefreshCw/> Next Question
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
       <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      `}</style>
    </div>
  );
}
