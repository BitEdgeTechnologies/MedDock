'use server';
/**
 * @fileOverview An AI flow to generate structured case summaries from clinical notes.
 *
 * - generateCaseSummary - A function that handles the case summary generation.
 * - CaseSummaryGeneratorInput - The input type for the generateCaseSummary function.
 * - CaseSummaryGeneratorOutput - The return type for the generateCaseSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CaseSummaryGeneratorInputSchema = z.object({
  notes: z.string().describe('The raw clinical notes or patient information.'),
});
export type CaseSummaryGeneratorInput = z.infer<typeof CaseSummaryGeneratorInputSchema>;

const CaseSummaryGeneratorOutputSchema = z.object({
  summary: z.string().describe('A structured case summary in a standard format (e.g., SOAP or similar).'),
});
export type CaseSummaryGeneratorOutput = z.infer<typeof CaseSummaryGeneratorOutputSchema>;

export async function generateCaseSummary(input: CaseSummaryGeneratorInput): Promise<CaseSummaryGeneratorOutput> {
  return caseSummaryGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'caseSummaryGeneratorPrompt',
  input: { schema: CaseSummaryGeneratorInputSchema },
  output: { schema: CaseSummaryGeneratorOutputSchema },
  prompt: `You are an expert medical AI assistant. Your task is to take unstructured clinical notes and generate a clear, concise, and structured case summary. Use a standard format like SOAP (Subjective, Objective, Assessment, Plan) or a similar logical structure.

  Clinical Notes:
  ---
  {{{notes}}}
  ---
  
  Generate a structured case summary based on the notes provided.
  `,
});

const caseSummaryGeneratorFlow = ai.defineFlow(
  {
    name: 'caseSummaryGeneratorFlow',
    inputSchema: CaseSummaryGeneratorInputSchema,
    outputSchema: CaseSummaryGeneratorOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
