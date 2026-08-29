import type { APIRoute } from 'astro';
import { createClientFromRequest } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const headers = new Headers();
  const supabase = createClientFromRequest(request, headers);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) { headers.set('Location', '/admin/login'); return new Response(null, { status: 303, headers }); }
  const form = await request.formData();
  const id = String(form.get('id') ?? '');
  const action = String(form.get('action') ?? '');
  if (id && action === 'activate') await supabase.from('home_banners').update({ active: true, updated_at: new Date().toISOString() }).eq('id', id);
  if (id && action === 'deactivate') await supabase.from('home_banners').update({ active: false, updated_at: new Date().toISOString() }).eq('id', id);
  if (id && action === 'delete') await supabase.from('home_banners').delete().eq('id', id);
  headers.set('Location', '/admin/banners'); return new Response(null, { status: 303, headers });
};
