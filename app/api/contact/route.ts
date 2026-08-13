import { NextRequest, NextResponse } from 'next/server';

interface ContactPayload {
  fullName: string;
  email: string;
  service: string;
  budget?: string;
  message: string;
}

const serviceLabels: Record<string, string> = {
  '3d-web': '3D Web Design & WebGL Experiences',
  'android': 'Android App Development',
  'enterprise': 'Enterprise Web Application',
};

const budgetLabels: Record<string, string> = {
  'under-5k': 'Under ₹5,00,000',
  '5k-20k': '₹5,00,000 – ₹20,00,000',
  '20k-50k': '₹20,00,000 – ₹50,00,000',
  '50k-plus': '₹50,00,000+',
  'flexible': 'Flexible / Let\'s discuss',
};

export async function POST(request: NextRequest) {
  try {
    const body: ContactPayload = await request.json();

    // Validate required fields
    if (!body.fullName?.trim() || !body.email?.trim() || !body.service || !body.message?.trim()) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      // In development without API key, log and return success
      console.log('[Contact Form Submission]', body);
      return NextResponse.json({ success: true, message: 'Message received (dev mode).' });
    }

    const serviceLabel = serviceLabels[body.service] || body.service;
    const budgetLabel = body.budget ? (budgetLabels[body.budget] || body.budget) : 'Not specified';
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0f; color: #e5e7eb; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
    .header { background: linear-gradient(135deg, #1e40af, #7c3aed); border-radius: 12px; padding: 28px; margin-bottom: 24px; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; color: #fff; }
    .header p { margin: 8px 0 0; font-size: 13px; color: #a5b4fc; }
    .card { background: #111118; border: 1px solid #1f2937; border-radius: 12px; padding: 24px; margin-bottom: 16px; }
    .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin-bottom: 6px; }
    .value { font-size: 15px; color: #f3f4f6; font-weight: 500; }
    .message-box { background: #0d0d14; border: 1px solid #1f2937; border-left: 3px solid #3b82f6; border-radius: 8px; padding: 16px; margin-top: 8px; }
    .message-box p { margin: 0; font-size: 14px; line-height: 1.6; color: #d1d5db; white-space: pre-wrap; }
    .footer { text-align: center; font-size: 12px; color: #4b5563; margin-top: 24px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #1e3a5f; color: #60a5fa; font-size: 11px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📩 New Project Inquiry</h1>
      <p>Received on ${timestamp} (IST) via srijandev.in</p>
    </div>

    <div class="card">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        <div>
          <div class="label">Full Name</div>
          <div class="value">${escapeHtml(body.fullName)}</div>
        </div>
        <div>
          <div class="label">Email</div>
          <div class="value"><a href="mailto:${escapeHtml(body.email)}" style="color:#60a5fa;">${escapeHtml(body.email)}</a></div>
        </div>
        <div>
          <div class="label">Service Required</div>
          <div class="value"><span class="badge">${escapeHtml(serviceLabel)}</span></div>
        </div>
        <div>
          <div class="label">Budget / Scope</div>
          <div class="value">${escapeHtml(budgetLabel)}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="label">Project Message</div>
      <div class="message-box">
        <p>${escapeHtml(body.message)}</p>
      </div>
    </div>

    <div class="footer">
      <p>This inquiry was submitted via the contact form at <strong>srijandev.in</strong></p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SrijanDev Contact Form <noreply@srijandev.in>',
        to: ['Contact@srijandev.in'],
        reply_to: body.email,
        subject: `[Project Inquiry] ${serviceLabel} — ${body.fullName}`,
        html: htmlContent,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json().catch(() => ({}));
      console.error('[Resend Error]', errorData);
      return NextResponse.json(
        { error: 'Failed to send message. Please email us directly at Contact@srijandev.in.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully.' });

  } catch (error) {
    console.error('[Contact API Error]', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please email us directly at Contact@srijandev.in.' },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
