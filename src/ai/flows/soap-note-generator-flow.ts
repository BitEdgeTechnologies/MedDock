'use server';
/**
 * @fileOverview An AI flow to generate structured SOAP notes from clinical data.
 *
 * - generateSoapNote - A function that handles the SOAP note generation.
 * - SoapNoteGeneratorInput - The input type for the generateSoapNote function.
 * - SoapNoteGeneratorOutput - The return type for the generateSoapNote function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SoapNoteGeneratorInputSchema = z.object({
  subjective: z.string().describe('Subjective information from the patient.'),
  objective: z.string().describe('Objective findings (vitals, exam, lab results).'),
});
export type SoapNoteGeneratorInput = z.infer<typeof SoapNoteGeneratorInputSchema>;

const SoapNoteGeneratorOutputSchema = z.object({
  assessment: z.string().describe('A concise assessment of the patient\'s condition.'),
  plan: z.string().describe('A structured plan for the patient.'),
});
export type SoapNoteGeneratorOutput = z.infer<typeof SoapNoteGeneratorOutputSchema>;

export async function generateSoapNote(input: SoapNoteGeneratorInput): Promise<SoapNoteGeneratorOutput> {
  return soapNoteGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'soapNoteGeneratorPrompt',
  input: { schema: SoapNoteGeneratorInputSchema },
  output: { schema: SoapNoteGeneratorOutputSchema },
  prompt: `You are an expert medical AI assistant for generating SOAP notes. Given the Subjective and Objective information, generate the Assessment and Plan.

  Subjective:
  ---
  {{{subjective}}}
  ---

  Objective:
  ---
  {{{objective}}}
  ---
  
  Generate a concise Assessment and a detailed, structured Plan.
  `,
});

const soapNoteGeneratorFlow = ai.defineFlow(
  {
    name: 'soapNoteGeneratorFlow',
    inputSchema: SoapNoteGeneratorInputSchema,
    outputSchema: SoapNoteGeneratorOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
