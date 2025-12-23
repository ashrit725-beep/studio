'use server';

/**
 * @fileOverview Analyzes the authenticity of government-issued ID documents using AI.
 *
 * - documentAuthenticityAnalysis - A function that analyzes the authenticity of an ID document.
 * - DocumentAuthenticityAnalysisInput - The input type for the documentAuthenticityAnalysis function.
 * - DocumentAuthenticityAnalysisOutput - The return type for the documentAuthenticityAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DocumentAuthenticityAnalysisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a government-issued ID document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DocumentAuthenticityAnalysisInput = z.infer<typeof DocumentAuthenticityAnalysisInputSchema>;

const DocumentAuthenticityAnalysisOutputSchema = z.object({
  authenticity: z.object({
    isReal: z.boolean().describe('Whether the document is likely real or fake.'),
    confidenceScore: z
      .number()
      .describe('A score between 0 and 1 indicating the confidence in the authenticity.'),
    analysisDetails: z.string().describe('The details of the analysis of the document.'),
  }),
});
export type DocumentAuthenticityAnalysisOutput = z.infer<typeof DocumentAuthenticityAnalysisOutputSchema>;

export async function documentAuthenticityAnalysis(
  input: DocumentAuthenticityAnalysisInput
): Promise<DocumentAuthenticityAnalysisOutput> {
  return documentAuthenticityAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'documentAuthenticityAnalysisPrompt',
  input: {schema: DocumentAuthenticityAnalysisInputSchema},
  output: {schema: DocumentAuthenticityAnalysisOutputSchema},
  prompt: `You are an expert in document authenticity verification.

You will analyze the provided government-issued ID document image to determine its authenticity.

Analyze the image and provide a confidence score (between 0 and 1) indicating the likelihood of the document being real.

Also include analysis details of the document.

Photo: {{media url=photoDataUri}}`,
});

const documentAuthenticityAnalysisFlow = ai.defineFlow(
  {
    name: 'documentAuthenticityAnalysisFlow',
    inputSchema: DocumentAuthenticityAnalysisInputSchema,
    outputSchema: DocumentAuthenticityAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
