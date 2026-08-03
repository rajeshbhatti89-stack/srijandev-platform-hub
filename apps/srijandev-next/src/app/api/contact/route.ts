import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Lead Submission Received:', body);
    return NextResponse.json({
      success: true,
      message: 'Proposal request logged. SrijanDev team will respond shortly.',
      leadId: `lead-${Date.now()}`,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
