import type { APIRoute } from 'astro';
import { createClientFromRequest } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers();
  const supabase = createClientFromRequest(request, responseHeaders);

  await supabase.auth.signOut();

  responseHeaders.set('Location', '/admin/login');
  return new Response(null, { status: 302, headers: responseHeaders });
};

export const POST: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers();
  const supabase = createClientFromRequest(request, responseHeaders);

  await supabase.auth.signOut();

  responseHeaders.set('Location', '/admin/login');
  return new Response(null, { status: 302, headers: responseHeaders });
};
