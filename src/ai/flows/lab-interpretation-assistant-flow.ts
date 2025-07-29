'use server';
/**
 * @fileOverview An AI flow to interpret lab results.
 *
 * - interpretLabResults - A function that returns an interpretation of lab results.
 * - LabInterpretationInput - The input type for the interpretLabResults function.
 * - LabInterpretationOutput - The return type for the interpretLabResults function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LabInterpretationInputSchema = z.object({
  labType: z.enum(['CBC', 'LFT', 'KFT']),
  results: z.string().describe('The lab results as a string of key-value pairs (e.g., "WBC: 12.5, HGB: 10.2, PLT: 150").'),
});
export type LabInterpretationInput = z.infer<typeof LabInterpretationInputSchema>;

const LabInterpretationOutputSchema = z.object({
  summary: z.string().describe('A high-level summary of the findings.'),
  interpretation: z.array(z.object({
    parameter: z.string().describe('The lab parameter (e.g., "WBC").'),
    value: z.string().describe('The reported value.'),
    finding: z.enum(['Normal', 'High', 'Low', 'Critical']).describe('The finding for this parameter.'),
    comment: z.string().describe('A comment or interpretation for this specific parameter.'),
  })).describe('A detailed breakdown of each parameter.'),
  differentials: z.array(z.string()).optional().describe('A list of potential differential diagnoses based on the results.'),
});
export type LabInterpretationOutput = z.infer<typeof LabInterpretationOutputSchema>;

export async function interpretLabResults(input: LabInterpretationInput): Promise<LabInterpretationOutput> {
  return labInterpretationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'labInterpretationPrompt',
  input: { schema: LabInterpretationInputSchema },
  output: { schema: LabInterpretationOutputSchema },
  prompt: `You are an expert hematologist and clinical pathologist AI. Your task is to interpret a set of lab results.

  The user has provided the following results for a {{labType}} panel:
  {{{results}}}
  
  Please analyze these results. For each parameter, provide the finding (Normal, High, Low, or Critical) and a brief comment. 
  Provide a summary of the overall picture and a list of potential differential diagnoses if abnormalities are present.
  
  Disclaimer: This is for educational purposes for healthcare professionals. All results must be correlated with clinical findings. This is not a substitute for clinical judgment.`,
});

const labInterpretationFlow = ai.defineFlow(
  {
    name: 'labInterpretationFlow',
    inputSchema: LabInterpretationInputSchema,
    outputSchema: LabInterpretationOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
