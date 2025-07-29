'use server';
/**
 * @fileOverview An AI flow for analyzing full lab reports for patterns.
 *
 * - analyzeLabReport - A function that handles the lab report analysis process.
 * - LabReportAnalyzerInput - The input type for the analyzeLabReport function.
 * - LabReportAnalyzerOutput - The return type for the analyzeLabReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LabReportAnalyzerInputSchema = z.object({
  reportText: z.string().describe('The full text of the lab report.'),
});
export type LabReportAnalyzerInput = z.infer<typeof LabReportAnalyzerInputSchema>;

const LabReportAnalyzerOutputSchema = z.object({
  overallAssessment: z.string().describe('An overall assessment of the lab report, highlighting key patterns and abnormalities.'),
  significantFindings: z.array(z.string()).describe('A list of the most significant findings or abnormalities.'),
  potentialImplications: z.string().describe('Potential clinical implications or suggestions for next steps based on the identified patterns.'),
});
export type LabReportAnalyzerOutput = z.infer<typeof LabReportAnalyzerOutputSchema>;

export async function analyzeLabReport(input: LabReportAnalyzerInput): Promise<LabReportAnalyzerOutput> {
  return labReportAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'labReportAnalyzerPrompt',
  input: { schema: LabReportAnalyzerInputSchema },
  output: { schema: LabReportAnalyzerOutputSchema },
  prompt: `You are an expert clinical pathologist AI with a specialization in identifying complex patterns in lab data. 
  
  Your task is to analyze the following comprehensive lab report. Look for interconnections between different results, identify trends or constellations of findings, and provide a high-level analysis.

  Lab Report Text:
  ---
  {{{reportText}}}
  ---
  
  Please provide:
  1. An overall assessment summarizing the key patterns.
  2. A bulleted list of the most significant individual findings.
  3. A summary of potential clinical implications and possible next steps (e.g., "Consider checking XYZ," "Findings are consistent with...").

  Disclaimer: This is for educational purposes for healthcare professionals. All results must be correlated with clinical findings and patient history. This is not a substitute for clinical judgment.`,
});

const labReportAnalyzerFlow = ai.defineFlow(
  {
    name: 'labReportAnalyzerFlow',
    inputSchema: LabReportAnalyzerInputSchema,
    outputSchema: LabReportAnalyzerOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
