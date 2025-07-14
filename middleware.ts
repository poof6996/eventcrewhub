import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { Role } from '@prisma/client';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Protect the /dashboard route for suppliers only
  if (pathname.startsWith('/dashboard')) {
    if (!session || session.user.role !== Role.SUPPLIER) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect pages for any logged-in user
  const protectedRoutes = ['/my-bookings', '/messages', '/bookings'];
  if (protectedRoutes.some(path => pathname.startsWith(path))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/my-bookings/:path*', '/messages/:path*', '/bookings/:path*'],
};