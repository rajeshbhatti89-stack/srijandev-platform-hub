import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    system: 'SrijanDev Next Generation Multi-Portal Platform',
    version: '2.5.0-phase2',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
}
