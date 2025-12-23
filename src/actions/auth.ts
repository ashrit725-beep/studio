"use server";

import { z } from "zod";
import { sendVerificationEmail } from "@/lib/email";

// This is a temporary in-memory store for verification codes.
// In a real application, you would use a database (like Firestore or Redis).
const verificationCodes = new Map<string, { code: string; expires: number }>();

const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export async function signUpWithEmail(data: unknown) {
  const parsed = signUpSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid data provided." };
  }

  const { email } = parsed.data;

  // In a real app, you would save the user to the database here,
  // probably with an 'unverified' status.

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

  verificationCodes.set(email, { code, expires });

  try {
    await sendVerificationEmail(email, code);
    return { success: true };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return { success: false, error: "Could not send verification email." };
  }
}

const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function verifyCode(data: unknown) {
    const parsed = verifyCodeSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: "Invalid data provided." };
    }

    const { email, code } = parsed.data;

    const stored = verificationCodes.get(email);

    if (!stored || stored.expires < Date.now()) {
        return { success: false, error: "Code is invalid or has expired." };
    }

    if (stored.code !== code) {
        return { success: false, error: "Invalid verification code." };
    }

    // In a real app, you would now mark the user as 'verified' in the database.
    verificationCodes.delete(email); // Clean up the code

    return { success: true };
}
