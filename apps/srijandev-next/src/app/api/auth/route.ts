import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      token: 'jwt-token-srijandev-mock-session-' + Date.now(),
      user: {
        id: 'emp-1',
        name: body.email ? body.email.split('@')[0] : 'Rajesh Bhatti',
        email: body.email || 'rajesh@srijandev.com',
        role: body.role || 'SUPER_ADMIN',
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
