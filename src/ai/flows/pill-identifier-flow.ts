'use server';
/**
 * @fileOverview An AI flow for identifying pills from an image and text description.
 *
 * - identifyPill - A function that handles the pill identification process.
 * - PillIdentifierInput - The input type for the identifyPill function.
 * - PillIdentifierOutput - The return type for the identifyPill function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PillIdentifierInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the pill, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  imprint: z.string().optional().describe('Any text or markings on the pill.'),
  color: z.string().optional().describe('The color of the pill.'),
  shape: z.string().optional().describe('The shape of the pill.'),
});
export type PillIdentifierInput = z.infer<typeof PillIdentifierInputSchema>;

const PillIdentifierOutputSchema = z.object({
  medicationName: z.string().describe('The name of the medication.'),
  strength: z.string().describe('The strength of the medication (e.g., 500mg).'),
  commonUses: z.string().describe('Common uses for the medication.'),
  importantWarnings: z.string().describe('Important warnings or side effects.'),
});
export type PillIdentifierOutput = z.infer<typeof PillIdentifierOutputSchema>;

export async function identifyPill(input: PillIdentifierInput): Promise<PillIdentifierOutput> {
  return identifyPillFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pillIdentifierPrompt',
  input: { schema: PillIdentifierInputSchema },
  output: { schema: PillIdentifierOutputSchema },
  prompt: `You are an expert pharmacist AI. Your task is to identify a pill based on the provided image and information. 

  Analyze the image and the following details to identify the medication.
  
  - Imprint: {{{imprint}}}
  - Color: {{{color}}}
  - Shape: {{{shape}}}
  - Photo: {{media url=photoDataUri}}
  
  Provide the medication name, its strength, common uses, and any important warnings. If you cannot identify the pill with high confidence, state that clearly and advise consulting a pharmacist or doctor. DO NOT GUESS.
  
  Disclaimer: Always confirm with a licensed healthcare professional before taking any medication.`,
});

const identifyPillFlow = ai.defineFlow(
  {
    name: 'identifyPillFlow',
    inputSchema: PillIdentifierInputSchema,
    outputSchema: PillIdentifierOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
