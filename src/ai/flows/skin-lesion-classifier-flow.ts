'use server';
/**
 * @fileOverview An AI flow for classifying skin lesions from an image.
 *
 * - classifySkinLesion - A function that handles the skin lesion classification process.
 * - SkinLesionClassifierInput - The input type for the classifySkinLesion function.
 * - SkinLesionClassifierOutput - The return type for the classifySkinLesion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SkinLesionClassifierInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the skin lesion, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SkinLesionClassifierInput = z.infer<typeof SkinLesionClassifierInputSchema>;

const SkinLesionClassifierOutputSchema = z.object({
  assessment: z.string().describe('The AI\'s assessment of the lesion.'),
  isSuspicious: z.boolean().describe('Whether the lesion shows suspicious characteristics.'),
  recommendation: z.string().describe('Recommended next steps for the user.'),
  confidenceScore: z.number().min(0).max(1).describe('The model\'s confidence in its assessment (0 to 1).'),
});
export type SkinLesionClassifierOutput = z.infer<typeof SkinLesionClassifierOutputSchema>;

export async function classifySkinLesion(input: SkinLesionClassifierInput): Promise<SkinLesionClassifierOutput> {
  return skinLesionClassifierFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skinLesionClassifierPrompt',
  input: { schema: SkinLesionClassifierInputSchema },
  output: { schema: SkinLesionClassifierOutputSchema },
  prompt: `You are a specialized AI assistant for dermatology. Your task is to analyze an image of a skin lesion and provide a preliminary assessment.

  Analyze the provided photo of the skin lesion: {{media url=photoDataUri}}
  
  Based on visual characteristics (e.g., asymmetry, border, color, diameter, evolution - ABCDEs), provide:
  1. A general assessment of the lesion.
  2. A boolean flag indicating if it has any suspicious characteristics.
  3. A confidence score for your assessment.
  4. A clear recommendation for the user (e.g., "Monitor the lesion," "Consult a dermatologist for a professional evaluation").
  
  Disclaimer: You are an AI assistant, not a medical professional. This is not a diagnosis. A definitive diagnosis can only be made by a qualified healthcare provider through a physical examination and, if necessary, a biopsy. Your analysis is for informational purposes only. Do not express high certainty. Always strongly recommend consulting a dermatologist.`,
});

const skinLesionClassifierFlow = ai.defineFlow(
  {
    name: 'skinLesionClassifierFlow',
    inputSchema: SkinLesionClassifierInputSchema,
    outputSchema: SkinLesionClassifierOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
