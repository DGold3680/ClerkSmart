import { NextApiRequest, NextApiResponse } from 'next';
import { autumnHandler } from "autumn-js/next";
import { auth } from "../../../lib/auth";

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

export default async function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Convert Next.js API request to fetch-like request for autumn-js
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const method = req.method!;
    
    const fetchRequest = new Request(url, {
      method,
      headers: req.headers as HeadersInit,
      body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    // Handle the request with autumn using the appropriate method
    let response: Response;
    if (method === 'GET' && handler.GET) {
      response = await handler.GET(fetchRequest as any);
    } else if (method === 'POST' && handler.POST) {
      response = await handler.POST(fetchRequest as any);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Convert Response back to Next.js API response
    const responseData = await response.text();
    
    res.status(response.status);
    
    // Set headers from autumn response
    response.headers.forEach((value: string, key: string) => {
      res.setHeader(key, value);
    });
    
    res.send(responseData);
  } catch (error) {
    console.error('Autumn handler error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}
