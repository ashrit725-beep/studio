'use server';

/**
 * @fileOverview Provides an AI-powered chatbot for user assistance within the application.
 *
 * - aiChatbotAssistance - A function that handles user queries and provides helpful responses.
 * - AiChatbotAssistanceInput - The input type for the aiChatbotAssistance function.
 * - AiChatbotAssistanceOutput - The return type for the aiChatbotAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiChatbotAssistanceInputSchema = z.object({
  query: z.string().describe('The user query for the chatbot.'),
});
export type AiChatbotAssistanceInput = z.infer<
  typeof AiChatbotAssistanceInputSchema
>;

const AiChatbotAssistanceOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user query.'),
});
export type AiChatbotAssistanceOutput = z.infer<
  typeof AiChatbotAssistanceOutputSchema
>;

export async function aiChatbotAssistance(
  input: AiChatbotAssistanceInput
): Promise<AiChatbotAssistanceOutput> {
  return aiChatbotAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotAssistancePrompt',
  input: {schema: AiChatbotAssistanceInputSchema},
  output: {schema: AiChatbotAssistanceOutputSchema},
  prompt: `You are a helpful AI chatbot for the "AI-NaMo" application. Your ONLY purpose is to assist users with questions about using the app.

  IMPORTANT: Do NOT discuss any political figures, including Narendra Modi, or any political topics. If asked, politely state that you can only answer questions about the AI-NaMo application.

  Respond to the following user query with helpful and informative information related to the app. If you do not know the answer, say that you are unsure.

  Query: {{{query}}} `,
});

const aiChatbotAssistanceFlow = ai.defineFlow(
  {
    name: 'aiChatbotAssistanceFlow',
    inputSchema: AiChatbotAssistanceInputSchema,
    outputSchema: AiChatbotAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
