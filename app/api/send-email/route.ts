import { NextRequest, NextResponse } from 'next/server';
import { sendClerkReportEmail } from '../../../services/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      recipientEmail, 
      feedback, 
      caseDetails, 
      preliminaryDiagnosis, 
      investigationPlan, 
      investigationResults, 
      finalDiagnosis, 
      managementPlan 
    } = body;

    if (!recipientEmail || !feedback) {
      return NextResponse.json(
        { error: 'Recipient email and feedback are required' },
        { status: 400 }
      );
    }

    await sendClerkReportEmail({
      recipientEmail,
      feedback,
      caseDetails,
      preliminaryDiagnosis,
      investigationPlan,
      investigationResults,
      finalDiagnosis,
      managementPlan,
    });

    return NextResponse.json({ 
      message: 'Email sent successfully' 
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 