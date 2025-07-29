'use server';
/**
 * @fileOverview An AI flow for generating medical mnemonics.
 *
 * - generateMnemonic - A function that handles the mnemonic generation process.
 * - MnemonicGeneratorInput - The input type for the generateMnemonic function.
 * - MnemonicGeneratorOutput - The return type for the generateMnemonic function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MnemonicGeneratorInputSchema = z.object({
  topic: z.string().describe('The medical topic or list of items to create a mnemonic for.'),
});
export type MnemonicGeneratorInput = z.infer<typeof MnemonicGeneratorInputSchema>;

const MnemonicGeneratorOutputSchema = z.object({
  mnemonics: z.array(z.object({
      mnemonic: z.string().describe('The generated mnemonic phrase or acronym.'),
      explanation: z.string().describe('An explanation of what each part of the mnemonic stands for.')
  })).describe('A list of creative and memorable mnemonics.'),
});
export type MnemonicGeneratorOutput = z.infer<typeof MnemonicGeneratorOutputSchema>;

export async function generateMnemonic(input: MnemonicGeneratorInput): Promise<MnemonicGeneratorOutput> {
  return mnemonicGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mnemonicGeneratorPrompt',
  input: { schema: MnemonicGeneratorInputSchema },
  output: { schema: MnemonicGeneratorOutputSchema },
  prompt: `You are an expert medical educator AI, specialized in creating clever and memorable mnemonics to help students learn complex topics.

  The user wants a mnemonic for the following topic: {{{topic}}}
  
  Please generate 2-3 distinct and creative mnemonics for this topic. Each mnemonic should be easy to remember and accurately represent the medical information. For each one, provide the mnemonic itself and a clear explanation of what each part stands for.`,
});

const mnemonicGeneratorFlow = ai.defineFlow(
  {
    name: 'mnemonicGeneratorFlow',
    inputSchema: MnemonicGeneratorInputSchema,
    outputSchema: MnemonicGeneratorOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
