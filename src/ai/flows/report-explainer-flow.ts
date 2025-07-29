'use server';
/**
 * @fileOverview An AI flow for explaining lab reports in simple terms.
 *
 * - explainReport - A function that handles the report explanation process.
 * - ReportExplainerInput - The input type for the explainReport function.
 * - ReportExplainerOutput - The return type for the explainReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ReportExplainerInputSchema = z.object({
  reportText: z.string().describe('The full text of the medical report.'),
});
export type ReportExplainerInput = z.infer<typeof ReportExplainerInputSchema>;

const ExplainedTermSchema = z.object({
    term: z.string().describe('The medical term.'),
    explanation: z.string().describe('The explanation of the term in simple language.'),
});

const ReportExplainerOutputSchema = z.object({
  mainSummary: z.string().describe('A high-level summary of the report in simple, easy-to-understand language.'),
  keyFindings: z.array(z.string()).describe('A list of the most important findings from the report, explained simply.'),
  glossary: z.array(ExplainedTermSchema).describe('A glossary of complex medical terms found in the report, with simple explanations for each.'),
});
export type ReportExplainerOutput = z.infer<typeof ReportExplainerOutputSchema>;

export async function explainReport(input: ReportExplainerInput): Promise<ReportExplainerOutput> {
  return reportExplainerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reportExplainerPrompt',
  input: { schema: ReportExplainerInputSchema },
  output: { schema: ReportExplainerOutputSchema },
  prompt: `You are an expert medical communicator AI. Your task is to translate a complex medical report into simple, easy-to-understand language for a patient with no medical background. Avoid jargon and use analogies where helpful.

  Medical Report Text:
  ---
  {{{reportText}}}
  ---
  
  Please provide:
  1.  **Main Summary:** A brief, high-level summary of what the report says.
  2.  **Key Findings:** A bulleted list of the most important findings and what they mean in simple terms.
  3.  **Glossary:** A list of any complex medical terms from the report with a very simple explanation for each.

  Disclaimer: This is for educational purposes only and is not a substitute for discussion with your healthcare provider, who can provide context based on your full medical history.`,
});

const reportExplainerFlow = ai.defineFlow(
  {
    name: 'reportExplainerFlow',
    inputSchema: ReportExplainerInputSchema,
    outputSchema: ReportExplainerOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
