'use server';
/**
 * @fileOverview An AI flow to generate a differential diagnosis.
 *
 * - generateDdx - A function that returns a list of differential diagnoses.
 * - DdxGeneratorInput - The input type for the generateDdx function.
 * - DdxGeneratorOutput - The return type for the generateDdx function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DdxGeneratorInputSchema = z.object({
  findings: z.string().describe('The clinical findings including symptoms, signs, history, and initial lab results.'),
});
export type DdxGeneratorInput = z.infer<typeof DdxGeneratorInputSchema>;

const DdxGeneratorOutputSchema = z.object({
  differentials: z.array(z.object({
    condition: z.string().describe('The name of the potential condition.'),
    reasoning: z.string().describe('The reasoning for including this condition in the differential diagnosis, based on the provided findings.'),
  })).describe('A list of potential differential diagnoses, ordered from most likely to least likely.'),
});
export type DdxGeneratorOutput = z.infer<typeof DdxGeneratorOutputSchema>;

export async function generateDdx(input: DdxGeneratorInput): Promise<DdxGeneratorOutput> {
  return ddxGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ddxGeneratorPrompt',
  input: { schema: DdxGeneratorInputSchema },
  output: { schema: DdxGeneratorOutputSchema },
  prompt: `You are an expert diagnostician AI. Your task is to generate a list of differential diagnoses based on a set of clinical findings.

  Clinical Findings:
  ---
  {{{findings}}}
  ---
  
  Based on the findings, generate a prioritized list of differential diagnoses. For each diagnosis, provide a brief reasoning connecting it to the provided data. Present the most likely diagnosis first.
  
  Disclaimer: This is for educational purposes for healthcare professionals. This is not a substitute for clinical judgment and patient evaluation.`,
});

const ddxGeneratorFlow = ai.defineFlow(
  {
    name: 'ddxGeneratorFlow',
    inputSchema: DdxGeneratorInputSchema,
    outputSchema: DdxGeneratorOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
