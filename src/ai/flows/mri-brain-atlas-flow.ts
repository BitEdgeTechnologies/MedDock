'use server';
/**
 * @fileOverview An AI flow for identifying and describing structures in a brain MRI.
 *
 * - analyzeMriBrain - A function that handles the MRI brain analysis process.
 * - MriBrainAtlasInput - The input type for the analyzeMriBrain function.
 * - MriBrainAtlasOutput - The return type for the analyzeMriBrain function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MriBrainAtlasInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "An MRI image of a brain, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type MriBrainAtlasInput = z.infer<typeof MriBrainAtlasInputSchema>;

const IdentifiedStructureSchema = z.object({
    structure: z.string().describe("The name of the identified anatomical structure."),
    description: z.string().describe("A brief description of the structure's function and significance."),
});

const MriBrainAtlasOutputSchema = z.object({
    identifiedStructures: z.array(IdentifiedStructureSchema).describe("A list of anatomical structures identified in the MRI image."),
    summary: z.string().describe("A high-level summary of the visible brain areas and their state.")
});
export type MriBrainAtlasOutput = z.infer<typeof MriBrainAtlasOutputSchema>;

export async function analyzeMriBrain(input: MriBrainAtlasInput): Promise<MriBrainAtlasOutput> {
  return mriBrainAtlasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mriBrainAtlasPrompt',
  input: { schema: MriBrainAtlasInputSchema },
  output: { schema: MriBrainAtlasOutputSchema },
  prompt: `You are an expert neuroanatomist AI. Your task is to act as an interactive atlas for a brain MRI.

  Analyze the provided brain MRI image: {{media url=photoDataUri}}
  
  Identify the key anatomical structures visible in this specific slice (e.g., frontal lobe, cerebellum, ventricles, corpus callosum). For each structure you identify, provide a brief description of its primary function.
  
  Provide a summary of the overall view (e.g., "This appears to be a sagittal view showing..."). Do not attempt to diagnose any pathology.
  
  Disclaimer: This is an AI-generated atlas for educational and informational purposes only. It is NOT a substitute for a diagnosis by a qualified radiologist.`,
});

const mriBrainAtlasFlow = ai.defineFlow(
  {
    name: 'mriBrainAtlasFlow',
    inputSchema: MriBrainAtlasInputSchema,
    outputSchema: MriBrainAtlasOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
