import { NextRequest, NextResponse } from 'next/server';
import { generateResponse } from '../../../services/ai-wrapper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, caseDetails, conversationHistory } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const response = await generateResponse(message, caseDetails, conversationHistory);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
} 