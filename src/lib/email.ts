import nodemailer from "nodemailer";

const smtpConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

export async function sendVerificationEmail(email: string, code: string) {
  const mailOptions = {
    from: `"AI-NaMo" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Welcome to AI-NaMo!</h2>
        <p>Your verification code is:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; background-color: #f0f0f0; padding: 10px; border-radius: 5px; display: inline-block;">${code}</p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not sign up for an account, you can ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
