'use server';
/**
 * @fileOverview An AI flow for checking the safety of drugs during pregnancy and lactation.
 *
 * - checkPregnancySafety - A function that returns the safety profile of a drug.
 * - PregnancySafetyInput - The input type for the checkPregnancySafety function.
 * - PregnancySafetyOutput - The return type for the checkPregnancySafety function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PregnancySafetyInputSchema = z.object({
  drugName: z.string().describe('The name of the drug to check.'),
});
export type PregnancySafetyInput = z.infer<typeof PregnancySafetyInputSchema>;

const PregnancySafetyOutputSchema = z.object({
  drugName: z.string().describe('The name of the drug that was checked.'),
  pregnancyCategory: z.enum(['A', 'B', 'C', 'D', 'X', 'N/A']).describe('The FDA Pregnancy Category (A, B, C, D, X) or N/A if not applicable.'),
  pregnancySummary: z.string().describe('A summary of the drug\'s safety profile during pregnancy, including known risks and clinical considerations.'),
  lactationSummary: z.string().describe('A summary of the drug\'s safety profile during lactation, including information about excretion in breast milk and potential effects on the infant.'),
});
export type PregnancySafetyOutput = z.infer<typeof PregnancySafetyOutputSchema>;

export async function checkPregnancySafety(input: PregnancySafetyInput): Promise<PregnancySafetyOutput> {
  return pregnancySafetyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pregnancySafetyPrompt',
  input: { schema: PregnancySafetyInputSchema },
  output: { schema: PregnancySafetyOutputSchema },
  prompt: `You are an expert clinical pharmacologist AI specializing in perinatal and lactation pharmacology. Your task is to provide a safety profile for a given drug.

  The user has provided the following drug: {{{drugName}}}
  
  Please provide the following information based on established guidelines (e.g., FDA pregnancy categories, recent studies):
  1.  **Pregnancy Category:** The FDA letter category (A, B, C, D, X). If not applicable or information is unavailable, use 'N/A'.
  2.  **Pregnancy Summary:** A concise summary of risks, teratogenic effects, and clinical considerations during pregnancy.
  3.  **Lactation Summary:** A concise summary regarding the drug's excretion into breast milk, potential effects on the nursing infant, and clinical recommendations.

  Disclaimer: This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.`,
});

const pregnancySafetyFlow = ai.defineFlow(
  {
    name: 'pregnancySafetyFlow',
    inputSchema: PregnancySafetyInputSchema,
    outputSchema: PregnancySafetyOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
