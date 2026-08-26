import type { APIRoute } from 'astro';
import { createClient } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  // Using Astro's cookie jar lets @supabase/ssr persist every auth cookie on
  // the final response, including chunked sessions.
  const supabase = createClient(cookies, request);

  const form = await request.formData();
  const email = form.get('email') as string;
  const password = form.get('password') as string;

  if (!email || !password) {
    return redirect('/admin/login?erro=credenciais', 303);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('[admin/login] Supabase authentication failed:', error.message);
    return redirect('/admin/login?erro=credenciais', 303);
  }

  return redirect('/admin', 303);
};
