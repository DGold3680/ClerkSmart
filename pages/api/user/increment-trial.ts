import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Increment trial usage count
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        trialsUsed: {
          increment: 1
        },
        updatedAt: new Date()
      },
      select: {
        id: true,
        trialsUsed: true,
        subscriptionStatus: true
      }
    });

    return res.status(200).json({
      success: true,
      trialsUsed: updatedUser.trialsUsed,
      trialsRemaining: Math.max(0, 5 - updatedUser.trialsUsed)
    });

  } catch (error) {
    console.error('Error incrementing trial usage:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
} 