import type { APIRoute } from 'astro';
import { createClientFromRequest } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const headers = new Headers();
  const supabase = createClientFromRequest(request, headers);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) { headers.set('Location', '/admin/login'); return new Response(null, { status: 302, headers }); }
  const form = await request.formData();
  const id = String(form.get('id') ?? '');
  const action = String(form.get('action') ?? '');
  if (id && ['unsubscribe', 'reactivate'].includes(action)) {
    await supabase.from('marketing_leads').update({ unsubscribed_at: action === 'unsubscribe' ? new Date().toISOString() : null }).eq('id', id);
  }
  headers.set('Location', '/admin/leads');
  return new Response(null, { status: 303, headers });
};
