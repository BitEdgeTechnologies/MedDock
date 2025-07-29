'use server';
/**
 * @fileOverview An AI flow to generate a summary for a medical disease.
 *
 * - getDiseaseSummary - A function that returns a structured summary of a disease.
 * - DiseaseSummaryInput - The input type for the getDiseaseSummary function.
 * - DiseaseSummaryOutput - The return type for the getDiseaseSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DiseaseSummaryInputSchema = z.object({
  disease: z.string().describe('The name of the medical disease.'),
});
export type DiseaseSummaryInput = z.infer<typeof DiseaseSummaryInputSchema>;

const DiseaseSummaryOutputSchema = z.object({
  diseaseName: z.string().describe('The name of the disease.'),
  overview: z.string().describe('A brief overview of the disease.'),
  pathophysiology: z.string().describe('The pathophysiology of the disease.'),
  signsAndSymptoms: z.string().describe('Common signs and symptoms.'),
  diagnosis: z.string().describe('How the disease is typically diagnosed.'),
  treatment: z.string().describe('Standard treatment approaches.'),
});
export type DiseaseSummaryOutput = z.infer<typeof DiseaseSummaryOutputSchema>;

export async function getDiseaseSummary(input: DiseaseSummaryInput): Promise<DiseaseSummaryOutput> {
  return diseaseSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diseaseSummaryPrompt',
  input: { schema: DiseaseSummaryInputSchema },
  output: { schema: DiseaseSummaryOutputSchema },
  prompt: `You are an expert medical knowledge AI. Your task is to generate a structured, high-yield summary for a specific medical disease, suitable for a medical student.

  The user has requested a summary for: {{{disease}}}
  
  Please provide a summary including the following sections:
  1.  Overview
  2.  Pathophysiology
  3.  Signs and Symptoms
  4.  Diagnosis
  5.  Treatment
  
  Ensure the information is accurate, concise, and up-to-date.
  `,
});

const diseaseSummaryFlow = ai.defineFlow(
  {
    name: 'diseaseSummaryFlow',
    inputSchema: DiseaseSummaryInputSchema,
    outputSchema: DiseaseSummaryOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
