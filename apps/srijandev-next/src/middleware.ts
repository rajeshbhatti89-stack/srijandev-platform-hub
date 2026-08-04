import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Agar request api.srijandev.in se aayi hai, to Render par pass-through karein
  if (hostname.startsWith('api.')) {
    url.href = `https://srijandev-backend.onrender.com${url.pathname}${url.search}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
