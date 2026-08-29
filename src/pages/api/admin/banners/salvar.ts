import type { APIRoute } from 'astro';
import { createClientFromRequest } from '../../../../lib/supabase';
import { uploadBannerImage } from '../../../../lib/banner-image';

export const POST: APIRoute = async ({ request }) => {
  const headers = new Headers();
  const supabase = createClientFromRequest(request, headers);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) { headers.set('Location', '/admin/login'); return new Response(null, { status: 303, headers }); }
  const form = await request.formData();
  const title = String(form.get('title') ?? '').trim().slice(0, 120);
  const imageAlt = String(form.get('image_alt') ?? '').trim().slice(0, 180);
  const destinationUrl = String(form.get('destination_url') ?? '').trim();
  const displaySeconds = Math.min(30, Math.max(3, Number(form.get('display_seconds') ?? 7)));
  const validDestination = destinationUrl.startsWith('/') || /^https?:\/\/[^\s]+$/i.test(destinationUrl);
  if (title.length < 2 || imageAlt.length < 2 || !validDestination) {
    headers.set('Location', '/admin/banners?erro=campos'); return new Response(null, { status: 303, headers });
  }
  const desktop = await uploadBannerImage(supabase, form.get('image'), 'desktop');
  if (desktop.error || !desktop.url) { headers.set('Location', `/admin/banners?erro=${desktop.error ?? 'imagem'}`); return new Response(null, { status: 303, headers }); }
  const mobile = await uploadBannerImage(supabase, form.get('mobile_image'), 'mobile');
  if (mobile.error) { headers.set('Location', `/admin/banners?erro=${mobile.error}`); return new Response(null, { status: 303, headers }); }
  const { error } = await supabase.from('home_banners').insert({ title, image_url: desktop.url, mobile_image_url: mobile.url, image_alt: imageAlt, destination_url: destinationUrl, display_seconds: displaySeconds, active: true });
  headers.set('Location', `/admin/banners?${error ? 'erro=db' : 'ok=1'}`);
  return new Response(null, { status: 303, headers });
};
