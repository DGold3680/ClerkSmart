import { auth } from "../../../lib/auth";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;
  
  const request = new Request(`${baseUrl}${req.url}`, {
    method: req.method,
    headers: new Headers(req.headers as any),
    body: req.method !== 'GET' && req.method !== 'HEAD' ? 
      (typeof req.body === 'string' ? req.body : JSON.stringify(req.body)) : 
      undefined,
  });
  
  const response = await auth.handler(request);
  
  // Copy response headers
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  
  // Set status and send response
  res.status(response.status);
  
  if (response.body) {
    const body = await response.text();
    res.send(body);
  } else {
    res.end();
  }
}