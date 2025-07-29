'use server';
/**
 * @fileOverview An AI flow to generate a clinical case simulation.
 *
 * - getCaseSimulation - A function that returns a clinical case scenario.
 * - CaseSimulationInput - The input type for the getCaseSimulation function.
 * - CaseSimulationOutput - The return type for the getCaseSimulation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CaseSimulationInputSchema = z.object({
  topic: z.string().describe('The medical topic for the case simulation (e.g., "Acute MI", "Diabetic Ketoacidosis").'),
});
export type CaseSimulationInput = z.infer<typeof CaseSimulationInputSchema>;

const CaseSimulationOutputSchema = z.object({
  scenario: z.string().describe('A detailed clinical scenario presenting a patient case.'),
  question: z.string().describe('A multiple-choice question based on the scenario.'),
  options: z.array(z.string()).describe('A list of 4-5 multiple-choice options.'),
  correctAnswer: z.string().describe('The correct answer from the options.'),
  explanation: z.string().describe('A detailed explanation of why the correct answer is right and the others are wrong.'),
});
export type CaseSimulationOutput = z.infer<typeof CaseSimulationOutputSchema>;

export async function getCaseSimulation(input: CaseSimulationInput): Promise<CaseSimulationOutput> {
  return caseSimulationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'caseSimulationPrompt',
  input: { schema: CaseSimulationInputSchema },
  output: { schema: CaseSimulationOutputSchema },
  prompt: `You are an expert medical educator AI. Your task is to create a challenging clinical case simulation for a medical student.

  The user wants a case about: {{{topic}}}
  
  Please generate the following:
  1. A realistic and detailed clinical scenario.
  2. A challenging multiple-choice question about the next best step in management or diagnosis.
  3. Four or five plausible options.
  4. The correct answer.
  5. A comprehensive explanation for the correct answer and why the distractors are incorrect.`,
});

const caseSimulationFlow = ai.defineFlow(
  {
    name: 'caseSimulationFlow',
    inputSchema: CaseSimulationInputSchema,
    outputSchema: CaseSimulationOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
