import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // Client-side: use current origin
    return window.location.origin;
  }
  
  // Server-side: use environment variable or fallback
  return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 
         process.env.NEXTAUTH_URL || 
         "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  requestPasswordReset,
  resetPassword,
} = authClient; 