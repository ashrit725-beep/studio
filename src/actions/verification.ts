"use server";

import { documentAuthenticityAnalysis } from "@/ai/flows/document-authenticity-analysis";

export async function verifyDocument(photoDataUri: string) {
  try {
    const result = await documentAuthenticityAnalysis({ photoDataUri });
    return { success: true, data: result };
  } catch (error) {
    console.error("Verification failed:", error);
    return { success: false, error: "Failed to analyze document." };
  }
}
