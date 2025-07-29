'use server';
/**
 * @fileOverview An AI flow for providing a preliminary interpretation of CT scan images.
 *
 * - interpretCtScan - A function that handles the CT scan interpretation process.
 * - CtScanInterpreterInput - The input type for the interpretCtScan function.
 * - CtScanInterpreterOutput - The return type for the interpretCtScan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CtScanInterpreterInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A CT scan image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  clinicalContext: z.string().optional().describe('Brief clinical history or question (e.g., "55M with sudden onset severe headache.").'),
});
export type CtScanInterpreterInput = z.infer<typeof CtScanInterpreterInputSchema>;

const CtScanInterpreterOutputSchema = z.object({
  findings: z.string().describe('A systematic description of the findings in the CT scan.'),
  impression: z.string().describe('The primary impression or conclusion from the findings.'),
  differentialDiagnoses: z.array(z.string()).describe('A list of possible differential diagnoses.'),
});
export type CtScanInterpreterOutput = z.infer<typeof CtScanInterpreterOutputSchema>;

export async function interpretCtScan(input: CtScanInterpreterInput): Promise<CtScanInterpreterOutput> {
  return ctScanInterpreterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ctScanInterpreterPrompt',
  input: { schema: CtScanInterpreterInputSchema },
  output: { schema: CtScanInterpreterOutputSchema },
  prompt: `You are an expert radiologist AI assistant specializing in computed tomography (CT). Your task is to provide a preliminary interpretation of a CT scan image.

  Analyze the provided CT scan image: {{media url=photoDataUri}}
  Clinical Context: {{{clinicalContext}}}
  
  Provide a structured report with the following sections:
  1.  **Findings:** Systematically describe what you see (e.g., abnormalities in density, masses, hemorrhages, fractures). Be descriptive and objective.
  2.  **Impression:** Synthesize the findings into a primary conclusion.
  3.  **Differential Diagnoses:** List potential conditions that could explain the findings.
  
  Disclaimer: This is an AI-generated interpretation for educational and informational purposes only. It is NOT a substitute for a diagnosis by a qualified radiologist and treating physician. Clinical correlation is required. DO NOT express high certainty. Always advise review by a human expert.`,
});

const ctScanInterpreterFlow = ai.defineFlow(
  {
    name: 'ctScanInterpreterFlow',
    inputSchema: CtScanInterpreterInputSchema,
    outputSchema: CtScanInterpreterOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
