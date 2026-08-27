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
  const allowed: Record<string, Record<string, boolean>> = {
    approve: { approved: true, active: true }, pause: { active: false }, activate: { active: true }, reject: { approved: false, active: false },
  };
  if (!id || !allowed[action]) { headers.set('Location', '/admin/patrocinios?erro=acao'); return new Response(null, { status: 303, headers }); }
  const { error } = await supabase.from('ad_campaigns').update({ ...allowed[action], updated_at: new Date().toISOString() }).eq('id', id);
  headers.set('Location', `/admin/patrocinios?${error ? 'erro=db' : 'ok=1'}`);
  return new Response(null, { status: 303, headers });
};
