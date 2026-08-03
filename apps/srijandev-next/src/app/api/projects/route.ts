import { NextResponse } from 'next/server';
import { PHASE2_PROJECTS } from '@/lib/mockDataPhase2';

export async function GET() {
  return NextResponse.json({
    success: true,
    total: PHASE2_PROJECTS.length,
    data: PHASE2_PROJECTS,
  });
}
