import type { APIRoute } from 'astro';
import { createClientFromRequest } from '../../../../lib/supabase';

const optional = (form: FormData, name: string) => String(form.get(name) ?? '').trim() || null;
const validHttpUrl = (value: string | null) => {
  if (!value) return true;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
};

export const POST: APIRoute = async ({ request }) => {
  const headers = new Headers();
  const supabase = createClientFromRequest(request, headers);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) { headers.set('Location', '/admin/login'); return new Response(null, { status: 302, headers }); }
  const form = await request.formData();
  const id = optional(form, 'id');
  const sponsor_name = optional(form, 'sponsor_name');
  const contact_email = optional(form, 'contact_email');
  const title = optional(form, 'title');
  const destination_url = optional(form, 'destination_url');
  const image_url = optional(form, 'image_url');
  const mobile_image_url = optional(form, 'mobile_image_url');
  const placement = optional(form, 'placement');
  if (!sponsor_name || !contact_email || !title || !destination_url || !['inline', 'sticky', 'popup'].includes(placement ?? '') || ![destination_url, image_url, mobile_image_url].every(validHttpUrl)) {
    headers.set('Location', `/admin/patrocinios/nova?erro=campos${id ? `&id=${id}` : ''}`);
    return new Response(null, { status: 303, headers });
  }
  const starts = optional(form, 'starts_at');
  const ends = optional(form, 'ends_at');
  const payload = {
    sponsor_name, contact_email, title, destination_url, image_url, mobile_image_url,
    description: optional(form, 'description'), placement, article_slug: optional(form, 'article_slug'),
    starts_at: starts ? new Date(starts).toISOString() : null,
    ends_at: ends ? new Date(ends).toISOString() : null,
    approved: form.get('approved') === 'true', active: form.get('active') === 'true', updated_at: new Date().toISOString(),
  };
  const { error } = id
    ? await supabase.from('ad_campaigns').update(payload).eq('id', id)
    : await supabase.from('ad_campaigns').insert(payload);
  headers.set('Location', `/admin/patrocinios?${error ? 'erro=db' : 'ok=1'}`);
  return new Response(null, { status: 303, headers });
};
