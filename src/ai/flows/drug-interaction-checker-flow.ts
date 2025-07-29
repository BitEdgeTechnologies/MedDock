'use server';
/**
 * @fileOverview An AI flow for checking potential drug interactions.
 *
 * - checkDrugInteractions - A function that handles the drug interaction checking process.
 * - DrugInteractionInput - The input type for the checkDrugInteractions function.
 * - DrugInteractionOutput - The return type for the checkDrugInteractions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DrugInteractionInputSchema = z.object({
  drugs: z.array(z.string()).min(2, 'Please enter at least two drugs to check for interactions.'),
});
export type DrugInteractionInput = z.infer<typeof DrugInteractionInputSchema>;

const DrugInteractionOutputSchema = z.object({
  interactionSummary: z.string().describe('A summary of the potential interactions found.'),
  interactions: z.array(z.object({
    drugA: z.string(),
    drugB: z.string(),
    severity: z.enum(['Mild', 'Moderate', 'Severe']),
    description: z.string(),
  })).describe('A list of specific interactions.'),
});
export type DrugInteractionOutput = z.infer<typeof DrugInteractionOutputSchema>;

export async function checkDrugInteractions(input: DrugInteractionInput): Promise<DrugInteractionOutput> {
  return drugInteractionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'drugInteractionPrompt',
  input: { schema: DrugInteractionInputSchema },
  output: { schema: DrugInteractionOutputSchema },
  prompt: `You are an expert clinical pharmacologist AI. Your task is to check for potential interactions between a list of drugs.

  The user has provided the following list of drugs:
  {{#each drugs}}
  - {{{this}}}
  {{/each}}
  
  Please analyze this list for any potential drug-drug interactions. For each interaction you find, describe it and classify its severity as 'Mild', 'Moderate', or 'Severe'.
  
  Provide a clear summary of your findings.
  
  Disclaimer: This information is for educational purposes only and is not a substitute for professional medical advice. Always consult with a healthcare provider.`,
});

const drugInteractionFlow = ai.defineFlow(
  {
    name: 'drugInteractionFlow',
    inputSchema: DrugInteractionInputSchema,
    outputSchema: DrugInteractionOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
