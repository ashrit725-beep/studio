"use server";

import { sendVerificationEmail } from "@/lib/email";

// This is a mock database. In a real application, you'd use a proper database
// like Firestore or a key-value store like Redis to manage codes.
const verificationCodes = new Map<string, { code: string; expires: number }>();

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Sends a verification code to the user's email.
 */
export async function sendVerificationCode({ email }: { email: string }) {
  try {
    const code = generateCode();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    verificationCodes.set(email, { code, expires });

    await sendVerificationEmail(email, code);

    return { success: true };
  } catch (error: any) {
    console.error("Failed to send verification email:", error);
    return { success: false, error: "Could not send verification email." };
  }
}

/**
 * Verifies the code entered by the user.
 */
export async function verifyCode({ email, code }: { email: string; code: string }) {
  const stored = verificationCodes.get(email);

  if (!stored) {
    return { success: false, error: "Invalid email or code has expired. Please try signing up again." };
  }

  if (Date.now() > stored.expires) {
    verificationCodes.delete(email);
    return { success: false, error: "Verification code has expired. Please try signing up again." };
  }

  if (stored.code !== code) {
    return { success: false, error: "Invalid verification code." };
  }

  // Once verified, remove the code from our temporary store
  verificationCodes.delete(email);
  
  // In a real app with Firebase Auth, you would now mark the user's email as verified.
  // Since we created the user with `createUserWithEmailAndPassword`, the user exists.
  // For this example, we'll assume this step is successful and redirect to login.
  // A more complete solution would involve custom claims or a flag in Firestore.
  
  return { success: true };
}
