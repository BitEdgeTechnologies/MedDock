'use server';
/**
 * @fileOverview An AI flow for providing a preliminary interpretation of ultrasound images.
 *
 * - interpretUltrasound - A function that handles the ultrasound interpretation process.
 * - UltrasoundInterpreterInput - The input type for the interpretUltrasound function.
 * - UltrasoundInterpreterOutput - The return type for the interpretUltrasound function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const UltrasoundInterpreterInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "An ultrasound image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  clinicalContext: z.string().optional().describe('Brief clinical history or question (e.g., "34F with right upper quadrant pain.").'),
});
export type UltrasoundInterpreterInput = z.infer<typeof UltrasoundInterpreterInputSchema>;

const UltrasoundInterpreterOutputSchema = z.object({
  findings: z.string().describe('A systematic description of the findings in the ultrasound image.'),
  impression: z.string().describe('The primary impression or conclusion from the findings.'),
  differentialDiagnoses: z.array(z.string()).describe('A list of possible differential diagnoses.'),
});
export type UltrasoundInterpreterOutput = z.infer<typeof UltrasoundInterpreterOutputSchema>;

export async function interpretUltrasound(input: UltrasoundInterpreterInput): Promise<UltrasoundInterpreterOutput> {
  return ultrasoundInterpreterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ultrasoundInterpreterPrompt',
  input: { schema: UltrasoundInterpreterInputSchema },
  output: { schema: UltrasoundInterpreterOutputSchema },
  prompt: `You are an expert radiologist AI assistant specializing in ultrasonography. Your task is to provide a preliminary interpretation of an ultrasound image.

  Analyze the provided ultrasound image: {{media url=photoDataUri}}
  Clinical Context: {{{clinicalContext}}}
  
  Provide a structured report with the following sections:
  1.  **Findings:** Systematically describe what you see (e.g., organ echotexture, size, presence of fluid, masses, vascular flow if Doppler is implied). Be descriptive and objective.
  2.  **Impression:** Synthesize the findings into a primary conclusion.
  3.  **Differential Diagnoses:** List potential conditions that could explain the findings.
  
  Disclaimer: This is an AI-generated interpretation for educational and informational purposes only. It is NOT a substitute for a diagnosis by a qualified radiologist and treating physician. Clinical correlation is required. DO NOT express high certainty. Always advise review by a human expert.`,
});

const ultrasoundInterpreterFlow = ai.defineFlow(
  {
    name: 'ultrasoundInterpreterFlow',
    inputSchema: UltrasoundInterpreterInputSchema,
    outputSchema: UltrasoundInterpreterOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
