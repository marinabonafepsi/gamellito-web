import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Get current user session (server-side)
 * Usage in Server Components and API routes
 */
export async function getSession() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Get current user with error handling
 */
export async function getUser() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get current user and throw error if not authenticated
 */
export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    redirect('/auth/login');
  }
  return user;
}

/**
 * Get user's role
 */
export async function getUserRole(): Promise<string | null> {
  const user = await getUser();
  if (!user) return null;
  return user.user_metadata?.role || 'familia';
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: string): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole === role;
}

/**
 * Require specific role or redirect
 */
export async function requireRole(requiredRole: string | string[]) {
  const user = await requireAuth();
  const userRole = user.user_metadata?.role;

  const rolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  if (!rolesArray.includes(userRole)) {
    // Redirect to home or appropriate dashboard
    const redirects: Record<string, string> = {
      familia: '/familia/dashboard',
      dm1: '/familia/dashboard',
      profissional: '/profissional/dashboard',
      educador: '/educador/dashboard',
      instituicao: '/instituicao/dashboard',
      admin: '/admin/dashboard',
    };
    redirect(redirects[userRole] || '/');
  }

  return user;
}

/**
 * Get familia_id (which is the user.id for familia role users)
 */
export async function getFamiliaId(): Promise<string | null> {
  const user = await getUser();
  if (!user || !['familia', 'dm1'].includes(user.user_metadata?.role)) {
    return null;
  }
  return user.id;
}

/**
 * Get profissional info
 */
export async function getProfissionalInfo() {
  const user = await requireRole('profissional');
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from('profissionais')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profissional info:', error);
    return null;
  }

  return data;
}

/**
 * Get instituicao_id from user's tenant_id
 */
export async function getTenantId(): Promise<string | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from('user_profiles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching tenant_id:', error);
    return null;
  }

  return data?.tenant_id || null;
}

/**
 * Get user profile with coins
 */
export async function getUserProfile() {
  const user = await getUser();
  if (!user) return null;

  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

/**
 * Check if user has permission to access another user's data
 * (for profissional accessing paciente)
 */
export async function hasPermissionFor(targetUserId: string): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;

  const supabase = createServerComponentClient({ cookies });

  // Admin can access everything
  if (user.user_metadata?.role === 'admin') {
    return true;
  }

  // Check if there's an active permission
  const { data, error } = await supabase
    .from('permissoes')
    .select('id')
    .eq('usuario_dono', targetUserId)
    .eq('usuario_acesso', user.id)
    .is('revogado_em', null)
    .or(
      `and(is(expira_em, null), expira_em.gt(${new Date().toISOString()}))`
    )
    .limit(1);

  if (error) {
    console.error('Error checking permission:', error);
    return false;
  }

  return (data?.length ?? 0) > 0;
}

/**
 * Get all children for a familia user
 */
export async function getFamiliaChildren() {
  const familiaId = await getFamiliaId();
  if (!familiaId) return [];

  const supabase = createServerComponentClient({ cookies });

  // For now, a familia only has one profile (representing the family unit)
  // In future, this could support multiple children
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', familiaId);

  if (error) {
    console.error('Error fetching children:', error);
    return [];
  }

  return data || [];
}

/**
 * Track user action in analytics
 */
export async function trackEvent(event: string, properties?: Record<string, any>) {
  const user = await getUser();

  const supabase = createServerComponentClient({ cookies });
  const { error } = await supabase.from('product_events').insert({
    user_id: user?.id || null,
    event,
    properties: properties || {},
  });

  if (error) {
    console.error('Error tracking event:', error);
  }
}

/**
 * Sign out user
 */
export async function signOut() {
  const supabase = createServerComponentClient({ cookies });
  await supabase.auth.signOut();
  redirect('/');
}
