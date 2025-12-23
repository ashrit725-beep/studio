import nodemailer from "nodemailer";

const smtpConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

export async function sendVerificationEmail(email: string, code: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.error("SMTP credentials are not set in the environment variables.");
    throw new Error("Email service is not configured.");
  }

  const mailOptions = {
    from: `"AI-NaMo" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your AI-NaMo Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #000;">Welcome to AI-NaMo!</h2>
        <p>Thank you for signing up. Please use the following code to verify your email address:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; background-color: #f2f2f2; padding: 12px 20px; border-radius: 5px; display: inline-block;">${code}</p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
        <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} AI-NaMo. All rights reserved.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
