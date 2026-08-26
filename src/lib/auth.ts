import type { AstroCookies } from 'astro';
import { createClient } from './supabase';

export async function getSession(cookies: AstroCookies, request: Request) {
  const supabase = createClient(cookies, request);
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;
  return session;
}

export async function requireAuth(cookies: AstroCookies, request: Request): Promise<Response | null> {
  const session = await getSession(cookies, request);
  if (!session) {
    // Response.redirect() creates immutable headers in Node/Undici. Astro adds
    // internal routing headers while rendering, so return a mutable Response.
    return new Response(null, {
      status: 302,
      headers: { Location: '/admin/login' },
    });
  }
  return null;
}
