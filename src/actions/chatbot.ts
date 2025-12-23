"use server";

import { aiChatbotAssistance } from "@/ai/flows/ai-chatbot-assistance";

export async function getChatbotResponse(query: string) {
  try {
    const result = await aiChatbotAssistance({ query });
    return { success: true, data: result };
  } catch (error) {
    console.error("Chatbot assistance failed:", error);
    return { success: false, error: "Sorry, I couldn't get a response. Please try again." };
  }
}
