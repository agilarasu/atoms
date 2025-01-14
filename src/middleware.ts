import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Extract the token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token is found, return an unauthorized response
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Apply middleware only to specific routes
export const config = {
  matcher: ['/api/chat', '/api/plans', '/api/plans/:path*'],
};
