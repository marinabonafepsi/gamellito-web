import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create response for chaining middleware
  let response = NextResponse.next({ request });

  // Create authenticated Supabase client for middleware
  const supabase = createMiddlewareClient({ req: request, res: response });

  // Refresh auth session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  // ============================================================================
  // RULE 1: Routes under /auth/* are always public
  // ============================================================================
  if (pathname.startsWith('/auth/')) {
    // If user is already logged in and accessing /auth/login, redirect to portal
    if (
      user &&
      (pathname === '/auth/login' || pathname === '/auth/signup')
    ) {
      const userRole = user.user_metadata?.role || 'familia';
      const redirects: Record<string, string> = {
        familia: '/familia/dashboard',
        profissional: '/profissional/dashboard',
        educador: '/educador/dashboard',
        instituicao: '/instituicao/dashboard',
        admin: '/admin/dashboard',
      };
      const redirect = redirects[userRole] || '/familia/dashboard';
      return NextResponse.redirect(new URL(redirect, request.url));
    }
    return response;
  }

  // ============================================================================
  // RULE 2: Routes under /familia/* require auth + role='familia'
  // ============================================================================
  if (pathname.startsWith('/familia/')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    const userRole = user.user_metadata?.role;
    if (userRole !== 'familia') {
      // Redirect to correct portal based on role
      const redirects: Record<string, string> = {
        profissional: '/profissional/dashboard',
        educador: '/educador/dashboard',
        instituicao: '/instituicao/dashboard',
        admin: '/admin/dashboard',
      };
      const redirect = redirects[userRole || ''] || '/auth/select-role';
      return NextResponse.redirect(new URL(redirect, request.url));
    }
    return response;
  }

  // ============================================================================
  // RULE 3: Routes under /profissional/* require auth + role='profissional'
  // ============================================================================
  if (pathname.startsWith('/profissional/')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    const userRole = user.user_metadata?.role;
    if (userRole !== 'profissional') {
      const redirects: Record<string, string> = {
        familia: '/familia/dashboard',
        educador: '/educador/dashboard',
        instituicao: '/instituicao/dashboard',
        admin: '/admin/dashboard',
      };
      const redirect = redirects[userRole || ''] || '/auth/select-role';
      return NextResponse.redirect(new URL(redirect, request.url));
    }
    return response;
  }

  // ============================================================================
  // RULE 4: Routes under /educador/* require auth + role='educador'
  // ============================================================================
  if (pathname.startsWith('/educador/')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    const userRole = user.user_metadata?.role;
    if (userRole !== 'educador') {
      const redirects: Record<string, string> = {
        familia: '/familia/dashboard',
        profissional: '/profissional/dashboard',
        instituicao: '/instituicao/dashboard',
        admin: '/admin/dashboard',
      };
      const redirect = redirects[userRole || ''] || '/auth/select-role';
      return NextResponse.redirect(new URL(redirect, request.url));
    }
    return response;
  }

  // ============================================================================
  // RULE 5: Routes under /instituicao/* require auth + role='instituicao'
  // ============================================================================
  if (pathname.startsWith('/instituicao/')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    const userRole = user.user_metadata?.role;
    if (userRole !== 'instituicao') {
      const redirects: Record<string, string> = {
        familia: '/familia/dashboard',
        profissional: '/profissional/dashboard',
        educador: '/educador/dashboard',
        admin: '/admin/dashboard',
      };
      const redirect = redirects[userRole || ''] || '/auth/select-role';
      return NextResponse.redirect(new URL(redirect, request.url));
    }
    return response;
  }

  // ============================================================================
  // RULE 6: Routes under /admin/* require auth + role='admin'
  // ============================================================================
  if (pathname.startsWith('/admin/')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    const userRole = user.user_metadata?.role;
    if (userRole !== 'admin') {
      // Non-admin users try to access admin → redirect to their portal
      const redirects: Record<string, string> = {
        familia: '/familia/dashboard',
        profissional: '/profissional/dashboard',
        educador: '/educador/dashboard',
        instituicao: '/instituicao/dashboard',
      };
      const redirect = redirects[userRole || ''] || '/';
      return NextResponse.redirect(new URL(redirect, request.url));
    }
    return response;
  }

  // ============================================================================
  // Default: Public routes are accessible without auth
  // ============================================================================
  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
