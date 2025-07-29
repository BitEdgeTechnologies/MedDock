'use server';
/**
 * @fileOverview An AI flow to provide antibiotic guidance based on a medical condition.
 *
 * - getAntibioticGuidance - A function that returns antibiotic recommendations.
 * - AntibioticGuideInput - The input type for the getAntibioticGuidance function.
 * - AntibioticGuideOutput - The return type for the getAntibioticGuidance function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AntibioticGuideInputSchema = z.object({
  condition: z.string().describe('The medical condition requiring antibiotic treatment.'),
});
export type AntibioticGuideInput = z.infer<typeof AntibioticGuideInputSchema>;

const AntibioticGuideOutputSchema = z.object({
  conditionSummary: z.string().describe('A brief summary of the medical condition.'),
  firstLineAntibiotics: z.array(z.string()).describe('First-line antibiotic choices.'),
  secondLineAntibiotics: z.array(z.string()).describe('Second-line antibiotic choices for cases like resistance or allergies.'),
  dosingAndDuration: z.string().describe('General guidance on dosing and duration for the recommended antibiotics.'),
  importantConsiderations: z.string().describe('Important considerations, such as potential side effects, resistance patterns, or patient-specific factors.'),
});
export type AntibioticGuideOutput = z.infer<typeof AntibioticGuideOutputSchema>;

export async function getAntibioticGuidance(input: AntibioticGuideInput): Promise<AntibioticGuideOutput> {
  return antibioticGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'antibioticGuidePrompt',
  input: { schema: AntibioticGuideInputSchema },
  output: { schema: AntibioticGuideOutputSchema },
  prompt: `You are an expert infectious disease pharmacist AI. Your task is to provide antibiotic treatment guidance for a specific medical condition.

  The user has specified the following condition: {{{condition}}}
  
  Based on current clinical guidelines, provide the following information:
  1. A brief summary of the condition.
  2. First-line antibiotic recommendations.
  3. Second-line antibiotic recommendations.
  4. General dosing and duration information.
  5. Important considerations (e.g., local resistance patterns, common side effects, key patient factors).
  
  Disclaimer: This information is for educational purposes for medical professionals and is not a substitute for clinical judgment or local guidelines. Treatment decisions should be individualized.`,
});

const antibioticGuideFlow = ai.defineFlow(
  {
    name: 'antibioticGuideFlow',
    inputSchema: AntibioticGuideInputSchema,
    outputSchema: AntibioticGuideOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
