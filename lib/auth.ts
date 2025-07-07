import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'ClerkSmart <onboarding@resend.dev>',
          to: user.email,
          subject: 'Reset Your ClerkSmart Password',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #0d9488;">Reset Your Password</h1>
              <p>Hi ${user.name || 'there'},</p>
              <p>We received a request to reset your password for your ClerkSmart account.</p>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" style="background: linear-gradient(to right, #14b8a6, #10b981); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
              </div>
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #6b7280;">${url}</p>
              <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                If you didn't request this password reset, you can safely ignore this email. Your password will not be changed.
              </p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
              <p style="font-size: 12px; color: #9ca3af;">
                This email was sent by ClerkSmart. If you have any questions, please contact our support team.
              </p>
            </div>
          `,
        });
      } catch (error) {
        console.error('Failed to send password reset email:', error);
        throw error;
      }
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    modelName: "session",
  },
  user: {
    modelName: "user",
  },
  account: {
    modelName: "account", 
  },
  verification: {
    modelName: "verification",
  },
});

export type Session = typeof auth.$Infer.Session; 