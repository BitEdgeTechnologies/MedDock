// A Genkit Flow for providing preliminary diagnoses based on user-inputted symptoms.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiDiagnosisAssistantInputSchema = z.object({
  symptoms: z.string().describe('The symptoms the user is experiencing.'),
});

export type AiDiagnosisAssistantInput = z.infer<typeof AiDiagnosisAssistantInputSchema>;

const AiDiagnosisAssistantOutputSchema = z.object({
  diagnosis: z.string().describe('A preliminary diagnosis based on the symptoms provided.'),
  potentialCauses: z.string().describe('Potential causes for the symptoms provided.'),
});

export type AiDiagnosisAssistantOutput = z.infer<typeof AiDiagnosisAssistantOutputSchema>;

export async function aiDiagnosisAssistant(input: AiDiagnosisAssistantInput): Promise<AiDiagnosisAssistantOutput> {
  return aiDiagnosisAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDiagnosisAssistantPrompt',
  input: {schema: AiDiagnosisAssistantInputSchema},
  output: {schema: AiDiagnosisAssistantOutputSchema},
  prompt: `You are an AI assistant that provides preliminary diagnoses based on symptoms provided by the user.

  Symptoms: {{{symptoms}}}

  Provide a preliminary diagnosis and potential causes for the symptoms.
  Diagnosis: 
  Potential Causes: `,
});

const aiDiagnosisAssistantFlow = ai.defineFlow(
  {
    name: 'aiDiagnosisAssistantFlow',
    inputSchema: AiDiagnosisAssistantInputSchema,
    outputSchema: AiDiagnosisAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
