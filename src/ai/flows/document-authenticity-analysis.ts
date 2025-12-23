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
  documentType: z.string().describe("The type of the document (e.g., Driver's License, Passport)."),
  authenticity: z.object({
    isReal: z.boolean().describe('Whether the document is likely real or fake.'),
    confidenceScore: z
      .number()
      .describe('A score between 0 and 1 indicating the confidence in the authenticity.'),
    analysisDetails: z.string().describe('A detailed analysis of the document, including checks for holograms, watermarks, and other security features.'),
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
  prompt: `You are an expert in document authenticity verification for government-issued IDs.

  Your task is to analyze the provided image of an ID document and determine its authenticity.

  1.  **Identify the Document Type**: First, identify the type of document (e.g., Driver's License, Passport, National ID).
  2.  **Analyze Authenticity**: Carefully examine the image for security features and potential signs of tampering. Check for:
      - Holograms: Look for reflections and authenticity seals.
      - Watermarks: Check for faint, embedded images or patterns.
      - Microprinting: Look for tiny, hard-to-replicate text.
      - Photo Quality: Assess if the photo seems legitimate or has been replaced.
      - Font Consistency: Ensure all text uses consistent and official fonts.
      - Overall Layout: Compare the layout to standard templates for that document type.
  3.  **Provide a Confidence Score**: Based on your analysis, provide a confidence score from 0.0 to 1.0 indicating how likely the document is to be authentic.
  4.  **Write Analysis Details**: Summarize your findings in a brief report. Mention the specific features you checked and whether they passed or failed.

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
