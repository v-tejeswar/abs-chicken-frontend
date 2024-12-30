import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('auth');
  const role = request.cookies.get('role')?.value;
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isUserPath = request.nextUrl.pathname.startsWith('/user');
  const isLoginPath = request.nextUrl.pathname === '/';

  if (!isAuthenticated && (isAdminPath || isUserPath)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAuthenticated && isLoginPath) {
    // Get user role from cookie
    // const role = request.cookies.get('role')?.value;
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/user', request.url));
  }

  if (isAuthenticated && isAdminPath && role !== 'admin') {
    // const role = request.cookies.get('role')?.value;
    return NextResponse.redirect(new URL('/user', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*', '/user/:path*'],
};