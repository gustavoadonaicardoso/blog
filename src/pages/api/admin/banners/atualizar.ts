import type { APIRoute } from 'astro';
import { createClientFromRequest } from '../../../../lib/supabase';
import { uploadBannerImage } from '../../../../lib/banner-image';
import { localeFromValue } from '../../../../lib/i18n';

export const POST: APIRoute = async ({ request }) => {
  const headers = new Headers();
  const supabase = createClientFromRequest(request, headers);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) { headers.set('Location', '/admin/login'); return new Response(null, { status: 303, headers }); }
  const form = await request.formData();
  const id = String(form.get('id') ?? '');
  const title = String(form.get('title') ?? '').trim().slice(0, 120) || null;
  const imageAlt = String(form.get('image_alt') ?? '').trim().slice(0, 180);
  const destinationUrl = String(form.get('destination_url') ?? '').trim();
  const displaySeconds = Math.min(30, Math.max(3, Number(form.get('display_seconds') ?? 7)));
  const locale = localeFromValue(String(form.get('locale') ?? ''));
  const active = form.get('active') === 'true';
  const validDestination = destinationUrl.startsWith('/') || /^https?:\/\/[^\s]+$/i.test(destinationUrl);
  if (!id || (title && title.length < 2) || imageAlt.length < 2 || !validDestination) {
    headers.set('Location', `/admin/banners/${id}?erro=campos`); return new Response(null, { status: 303, headers });
  }
  const desktop = await uploadBannerImage(supabase, form.get('image'), 'desktop');
  const mobile = await uploadBannerImage(supabase, form.get('mobile_image'), 'mobile');
  const uploadError = desktop.error ?? mobile.error;
  if (uploadError) { headers.set('Location', `/admin/banners/${id}?erro=${uploadError}`); return new Response(null, { status: 303, headers }); }
  const changes: Record<string, unknown> = { title, image_alt: imageAlt, destination_url: destinationUrl, display_seconds: displaySeconds, locale, active, updated_at: new Date().toISOString() };
  if (desktop.url) changes.image_url = desktop.url;
  if (mobile.url) changes.mobile_image_url = mobile.url;
  else if (form.get('remove_mobile') === 'true') changes.mobile_image_url = null;
  const { error } = await supabase.from('home_banners').update(changes).eq('id', id);
  headers.set('Location', `/admin/banners/${id}?${error ? 'erro=db' : 'ok=1'}`);
  return new Response(null, { status: 303, headers });
};
