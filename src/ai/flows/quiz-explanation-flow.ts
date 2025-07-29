'use server';
/**
 * @fileOverview An AI flow for explaining quiz answers.
 *
 * - getQuizExplanation - A function that provides an explanation for a quiz answer.
 * - QuizExplanationInput - The input type for the getQuizExplanation function.
 * - QuizExplanationOutput - The return type for the getQuizExplanation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const QuizExplanationInputSchema = z.object({
  question: z.string().describe('The quiz question.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  selectedAnswer: z.string().describe('The answer the user selected.'),
});
export type QuizExplanationInput = z.infer<typeof QuizExplanationInputSchema>;

const QuizExplanationOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of why the correct answer is right and why the other options (if applicable) are wrong.'),
});
export type QuizExplanationOutput = z.infer<typeof QuizExplanationOutputSchema>;

export async function getQuizExplanation(input: QuizExplanationInput): Promise<QuizExplanationOutput> {
  return quizExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'quizExplanationPrompt',
  input: { schema: QuizExplanationInputSchema },
  output: { schema: QuizExplanationOutputSchema },
  prompt: `You are an expert medical tutor AI. Your task is to provide a clear and educational explanation for a quiz question.

  Question: "{{{question}}}"
  Correct Answer: "{{{correctAnswer}}}"
  The user selected: "{{{selectedAnswer}}}"

  Please provide a detailed explanation. If the user was correct, reinforce the concept. If the user was incorrect, gently explain why their answer was wrong and why the correct answer is right. Keep the tone encouraging and educational.`,
});

const quizExplanationFlow = ai.defineFlow(
  {
    name: 'quizExplanationFlow',
    inputSchema: QuizExplanationInputSchema,
    outputSchema: QuizExplanationOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
