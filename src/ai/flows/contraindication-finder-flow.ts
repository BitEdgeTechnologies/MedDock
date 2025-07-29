'use server';
/**
 * @fileOverview An AI flow for finding contraindications for drugs.
 *
 * - findContraindications - A function that returns contraindications for a given drug and optional condition.
 * - ContraindicationFinderInput - The input type for the findContraindications function.
 * - ContraindicationFinderOutput - The return type for the findContraindications function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ContraindicationFinderInputSchema = z.object({
  drugName: z.string().describe('The name of the drug to check.'),
  condition: z.string().optional().describe('An optional medical condition to check against the drug.'),
});
export type ContraindicationFinderInput = z.infer<typeof ContraindicationFinderInputSchema>;

const ContraindicationSchema = z.object({
    contraindication: z.string().describe('The specific contraindication.'),
    explanation: z.string().describe('A brief explanation of why it is contraindicated.'),
    severity: z.enum(['Absolute', 'Relative', 'Warning']).describe('The severity of the contraindication.'),
});

const ContraindicationFinderOutputSchema = z.object({
    drugName: z.string().describe('The name of the drug that was checked.'),
    contraindications: z.array(ContraindicationSchema).describe('A list of found contraindications.'),
});
export type ContraindicationFinderOutput = z.infer<typeof ContraindicationFinderOutputSchema>;

export async function findContraindications(input: ContraindicationFinderInput): Promise<ContraindicationFinderOutput> {
  return contraindicationFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contraindicationFinderPrompt',
  input: { schema: ContraindicationFinderInputSchema },
  output: { schema: ContraindicationFinderOutputSchema },
  prompt: `You are an expert clinical pharmacologist AI. Your task is to identify and explain contraindications for a given medication.

  Drug: {{{drugName}}}
  {{#if condition}}
  Specific condition to consider: {{{condition}}}
  {{/if}}
  
  Based on established clinical guidelines, please provide a list of contraindications for this drug. For each contraindication, specify its severity ('Absolute', 'Relative', 'Warning') and provide a brief explanation. If a specific condition is provided, prioritize any contraindications related to it.
  
  Disclaimer: This information is for educational purposes only and is not a substitute for professional medical advice. Always consult with a healthcare provider and refer to official drug monographs.`,
});

const contraindicationFinderFlow = ai.defineFlow(
  {
    name: 'contraindicationFinderFlow',
    inputSchema: ContraindicationFinderInputSchema,
    outputSchema: ContraindicationFinderOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
