import { autumnHandler } from "autumn-js/next";
import { auth } from "../../../../lib/auth";

const handler = autumnHandler({
  identify: async (request) => {
    // Get the user from Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    return {
      customerId: session.user.id,
      customerData: {
        name: session.user.name,
        email: session.user.email,
      },
    };
  },
});

export const { GET, POST } = handler; 