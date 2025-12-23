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
  prompt: `You are an expert system in document authenticity verification for government-issued IDs, including international documents, similar to Google Document AI. Your task is to meticulously analyze the provided image of an ID document and determine its authenticity with a high degree of accuracy.

  Follow these steps precisely:

  1.  **Identify Document Type**: First, identify the specific type and country of the document (e.g., California Driver's License, Indian Passport, etc.). If you cannot determine the type, state "Unknown Document Type".

  2.  **Analyze Authenticity**: Carefully examine the image for standard security features and common signs of forgery or tampering. Your analysis MUST check for:
      - **Holograms**: Look for holographic overlays, seals, or images. Note their presence, appearance, and if they reflect light as expected.
      - **Watermarks**: Check for faint, embedded images or patterns that are part of the document paper or material.
      - **Microprinting**: Identify any areas that should contain micro-text and assess if it appears clear and legible under magnification, or if it's blurred or unreadable.
      - **Photo Quality & Integration**: Assess if the portrait photo seems legitimate, properly integrated into the document, or if it looks like it has been replaced or digitally altered. Check for consistent lighting and background.
      - **Font Consistency & Quality**: Ensure all text uses official, consistent fonts. Look for variations in font type, size, or alignment that could indicate alteration.
      - **Overall Layout & Spacing**: Compare the layout, spacing of elements, and borders to known templates for that specific document type. Note any deviations.

  3.  **Determine Authenticity & Confidence Score**:
      - Based on the presence and quality of the security features, classify the document by setting the \`isReal\` boolean field to \`true\` for likely authentic or \`false\` for likely fake/altered.
      - Provide a \`confidenceScore\` from 0.0 (no confidence it's real) to 1.0 (very high confidence it's real). A real document should have a score above 0.8. A document with several missing or flawed features should have a score below 0.5.

  4.  **Write Detailed Analysis**:
      - Summarize your findings in the \`analysisDetails\` field.
      - Your summary must be a step-by-step report of the features you checked. For each feature (Hologram, Watermark, etc.), state whether it 'Passed', 'Failed', or was 'Not Applicable'/'Not Visible', and provide a brief justification.

  Begin analysis on the provided photo.

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
