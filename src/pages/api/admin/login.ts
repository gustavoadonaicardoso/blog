import type { APIRoute } from 'astro';
import { createClientFromRequest } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers();
  const supabase = createClientFromRequest(request, responseHeaders);

  const form = await request.formData();
  const email = form.get('email') as string;
  const password = form.get('password') as string;

  if (!email || !password) {
    responseHeaders.set('Location', '/admin/login?erro=credenciais');
    return new Response(null, { status: 302, headers: responseHeaders });
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    responseHeaders.set('Location', '/admin/login?erro=credenciais');
    return new Response(null, { status: 302, headers: responseHeaders });
  }

  responseHeaders.set('Location', '/admin');
  return new Response(null, { status: 302, headers: responseHeaders });
};
