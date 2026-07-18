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

  // Source of truth for role is user_profiles.role, not the auth
  // user_metadata (which can be stale/unset for accounts created before the
  // role-metadata convention existed, or via some OAuth paths). Only fall
  // back to user_metadata for the brief window right after signup before
  // the on_auth_user_created trigger has run. Same rule as getUserRole() in
  // src/lib/auth-helpers.ts.
  //
  // Note: 'admin' is not one of the portals routed here — admin access
  // moved to a separate app (gamellito-erp), so this site has no /admin/*
  // routes anymore.
  let userRole: string | undefined;
  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    userRole = profile?.role || user.user_metadata?.role || 'familia';
  }

  // ============================================================================
  // RULE 1: Routes under /auth/* are always public
  // ============================================================================
  if (pathname.startsWith('/auth/')) {
    // If user is already logged in and accessing /auth/login, redirect to portal
    if (
      user &&
      (pathname === '/auth/login' || pathname === '/auth/signup')
    ) {
      const redirects: Record<string, string> = {
        familia: '/familia/dashboard',
        profissional: '/profissional/dashboard',
        educador: '/educador/dashboard',
        instituicao: '/instituicao/dashboard',
      };
      const redirect = redirects[userRole || ''] || '/familia/dashboard';
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
    if (userRole !== 'familia' && userRole !== 'dm1') {
      // Redirect to correct portal based on role
      const redirects: Record<string, string> = {
        profissional: '/profissional/dashboard',
        educador: '/educador/dashboard',
        instituicao: '/instituicao/dashboard',
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
    if (userRole !== 'profissional') {
      const redirects: Record<string, string> = {
        familia: '/familia/dashboard',
        educador: '/educador/dashboard',
        instituicao: '/instituicao/dashboard',
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
    if (userRole !== 'educador') {
      const redirects: Record<string, string> = {
        familia: '/familia/dashboard',
        profissional: '/profissional/dashboard',
        instituicao: '/instituicao/dashboard',
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
    if (userRole !== 'instituicao') {
      const redirects: Record<string, string> = {
        familia: '/familia/dashboard',
        profissional: '/profissional/dashboard',
        educador: '/educador/dashboard',
      };
      const redirect = redirects[userRole || ''] || '/auth/select-role';
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
