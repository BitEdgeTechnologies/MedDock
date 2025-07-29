'use server';
/**
 * @fileOverview An AI flow for analyzing urinalysis reports.
 *
 * - analyzeUrineReport - A function that handles the urine report analysis process.
 * - UrineAnalyzerInput - The input type for the analyzeUrineReport function.
 * - UrineAnalyzerOutput - The return type for the analyzeUrineReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const UrineAnalyzerInputSchema = z.object({
  reportText: z.string().describe('The full text of the urinalysis report.'),
});
export type UrineAnalyzerInput = z.infer<typeof UrineAnalyzerInputSchema>;

const UrineParameterSchema = z.object({
    parameter: z.string().describe('The lab parameter (e.g., "Color", "Protein").'),
    value: z.string().describe('The reported value (e.g., "Yellow", "Negative").'),
    finding: z.enum(['Normal', 'Abnormal', 'Trace']).describe('The finding for this parameter.'),
    comment: z.string().describe('A brief interpretation for this specific parameter.'),
});

const UrineAnalyzerOutputSchema = z.object({
  summary: z.string().describe('An overall summary of the urinalysis findings.'),
  interpretation: z.array(UrineParameterSchema).describe('A detailed breakdown of each parameter in the report.'),
  potentialImplications: z.string().describe('Potential clinical implications based on the findings.'),
});
export type UrineAnalyzerOutput = z.infer<typeof UrineAnalyzerOutputSchema>;

export async function analyzeUrineReport(input: UrineAnalyzerInput): Promise<UrineAnalyzerOutput> {
  return urineAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'urineAnalyzerPrompt',
  input: { schema: UrineAnalyzerInputSchema },
  output: { schema: UrineAnalyzerOutputSchema },
  prompt: `You are an expert clinical pathologist AI. Your task is to analyze the following urinalysis report. 
  
  For each parameter (e.g., color, clarity, pH, specific gravity, protein, glucose, ketones, blood, leukocytes, nitrites), provide the result, a finding (Normal, Abnormal, or Trace), and a brief interpretation.
  
  Then, provide an overall summary of the findings and potential clinical implications.

  Urinalysis Report Text:
  ---
  {{{reportText}}}
  ---
  
  Disclaimer: This is for educational purposes for healthcare professionals. All results must be correlated with clinical findings and patient history. This is not a substitute for clinical judgment.`,
});

const urineAnalyzerFlow = ai.defineFlow(
  {
    name: 'urineAnalyzerFlow',
    inputSchema: UrineAnalyzerInputSchema,
    outputSchema: UrineAnalyzerOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
