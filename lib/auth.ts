import { betterAuth } from "better-auth";
import { Pool } from "pg"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
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