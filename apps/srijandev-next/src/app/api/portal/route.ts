import { NextResponse } from 'next/server';
import { CORPORATE_SERVICES, PLATFORM_METRICS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    system: 'SrijanDev Next Generation Multi-Portal Platform',
    version: '2.5.0',
    corporateServices: CORPORATE_SERVICES.length,
    metrics: PLATFORM_METRICS,
    timestamp: new Date().toISOString(),
  });
}
