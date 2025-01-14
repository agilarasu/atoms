import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;
  
  // Exclude authentication and login routes
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  // Extract token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // API-specific logic
  if (pathname.startsWith('/api')) {
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Frontend-specific logic
  if (pathname.startsWith('/chat') || pathname.startsWith('/plans')) {
    if (!token) {
      const loginUrl = new URL('/login', url.origin);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Allow all other requests
  return NextResponse.next();
}
