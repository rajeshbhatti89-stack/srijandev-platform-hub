import { NextResponse } from 'next/server';
import { PLATFORM_EMPLOYEES } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    total: PLATFORM_EMPLOYEES.length,
    data: PLATFORM_EMPLOYEES,
  });
}
