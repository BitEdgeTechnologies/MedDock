'use server';
/**
 * @fileOverview An AI flow for providing a preliminary interpretation of X-ray images.
 *
 * - interpretXray - A function that handles the X-ray interpretation process.
 * - XrayInterpreterInput - The input type for the interpretXray function.
 * - XrayInterpreterOutput - The return type for the interpretXray function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const XrayInterpreterInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "An X-ray image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  clinicalContext: z.string().optional().describe('Brief clinical history or question (e.g., "70M with cough and fever").'),
});
export type XrayInterpreterInput = z.infer<typeof XrayInterpreterInputSchema>;

const XrayInterpreterOutputSchema = z.object({
  findings: z.string().describe('A systematic description of the findings in the X-ray.'),
  impression: z.string().describe('The primary impression or conclusion from the findings.'),
  differentialDiagnoses: z.array(z.string()).describe('A list of possible differential diagnoses.'),
});
export type XrayInterpreterOutput = z.infer<typeof XrayInterpreterOutputSchema>;

export async function interpretXray(input: XrayInterpreterInput): Promise<XrayInterpreterOutput> {
  return xrayInterpreterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'xrayInterpreterPrompt',
  input: { schema: XrayInterpreterInputSchema },
  output: { schema: XrayInterpreterOutputSchema },
  prompt: `You are an expert radiologist AI assistant. Your task is to provide a preliminary interpretation of an X-ray image.

  Analyze the provided X-ray image: {{media url=photoDataUri}}
  Clinical Context: {{{clinicalContext}}}
  
  Provide a structured report with the following sections:
  1.  **Findings:** Systematically describe what you see (e.g., lungs, heart, bones, soft tissues). Be descriptive and objective.
  2.  **Impression:** Synthesize the findings into a primary conclusion.
  3.  **Differential Diagnoses:** List potential conditions that could explain the findings.
  
  Disclaimer: This is an AI-generated interpretation for educational and informational purposes only. It is NOT a substitute for a diagnosis by a qualified radiologist and treating physician. Clinical correlation is required. DO NOT express high certainty. Always advise review by a human expert.`,
});

const xrayInterpreterFlow = ai.defineFlow(
  {
    name: 'xrayInterpreterFlow',
    inputSchema: XrayInterpreterInputSchema,
    outputSchema: XrayInterpreterOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
