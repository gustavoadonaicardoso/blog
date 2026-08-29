import type { APIRoute } from 'astro';
import { createClientFromRequest } from '../../../../lib/supabase';
import { uploadPostImage } from '../../../../lib/post-image';

export const POST: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers();
  const supabase = createClientFromRequest(request, responseHeaders);

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    responseHeaders.set('Location', '/admin/login');
    return new Response(null, { status: 302, headers: responseHeaders });
  }

  const form = await request.formData();
  const id = form.get('id') as string;
  const title = form.get('title') as string;
  const slug = form.get('slug') as string;
  const excerpt = (form.get('excerpt') as string) || null;
  const content = (form.get('content') as string) || null;
  const published = form.get('published') === 'true';
  const is_sponsored = form.get('is_sponsored') === 'true';
  const sponsor_name = is_sponsored ? ((form.get('sponsor_name') as string) || null) : null;
  const sponsor_url = is_sponsored ? ((form.get('sponsor_url') as string) || null) : null;
  const sponsor_badge = is_sponsored ? ((form.get('sponsor_badge') as string) || null) : null;
  const image_alt = String(form.get('image_alt') ?? '').trim().slice(0, 180) || null;
  const remove_image = form.get('remove_image') === 'true';

  if (!id || !title || !slug) {
    responseHeaders.set('Location', `/admin/posts/${id}?erro=campos`);
    return new Response(null, { status: 302, headers: responseHeaders });
  }

  const image = await uploadPostImage(supabase, form.get('image'));
  if (image.error) {
    responseHeaders.set('Location', `/admin/posts/${id}?erro=${image.error}`);
    return new Response(null, { status: 303, headers: responseHeaders });
  }

  const imageFields = image.url
    ? { image_url: image.url, image_alt }
    : remove_image
      ? { image_url: null, image_alt: null }
      : { image_alt };

  const { error } = await supabase
    .from('posts')
    .update({
      title,
      slug,
      excerpt,
      content,
      published,
      is_sponsored,
      sponsor_name,
      sponsor_url,
      sponsor_badge,
      ...imageFields,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    responseHeaders.set('Location', `/admin/posts/${id}?erro=db`);
    return new Response(null, { status: 302, headers: responseHeaders });
  }

  responseHeaders.set('Location', `/admin/posts/${id}?ok=1`);
  return new Response(null, { status: 302, headers: responseHeaders });
};
