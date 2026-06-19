import type { AstroCookies } from 'astro';
import { createClient } from './supabase';

export async function getSession(cookies: AstroCookies) {
  const supabase = createClient(cookies);
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;
  return session;
}

export async function requireAuth(cookies: AstroCookies): Promise<Response | null> {
  const session = await getSession(cookies);
  if (!session) {
    return Response.redirect(new URL('/admin/login', import.meta.env.SITE_URL ?? 'http://localhost:4321'), 302);
  }
  return null;
}
