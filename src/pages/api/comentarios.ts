import type { APIRoute } from 'astro';
import { createClientFromRequest } from '../../lib/supabase';
import { localeFromValue } from '../../lib/i18n';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  const headers = new Headers();
  const supabase = createClientFromRequest(request, headers);
  const form = await request.formData();

  const postId = String(form.get('post_id') ?? '').trim();
  const slug = String(form.get('slug') ?? '').trim();
  const locale = localeFromValue(String(form.get('lang') ?? ''));
  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const content = String(form.get('content') ?? '').trim();
  const website = String(form.get('website') ?? '').trim();
  const target = `/artigos/${encodeURIComponent(slug)}${locale === 'pt-BR' ? '' : `?lang=${locale}`}`;

  // Campo invisível: bots costumam preenchê-lo. Respondemos sem gravar.
  if (website) {
    headers.set('Location', `${target}?comentario=enviado#comentarios`);
    return new Response(null, { status: 303, headers });
  }

  if (
    !postId || !slug || name.length < 2 || name.length > 80 ||
    !emailPattern.test(email) || email.length > 254 ||
    content.length < 3 || content.length > 2000
  ) {
    headers.set('Location', `${target}?comentario=invalido#comentar`);
    return new Response(null, { status: 303, headers });
  }

  const { data: post } = await supabase
    .from('posts')
    .select('id')
    .eq('id', postId)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (!post) {
    headers.set('Location', `${target}?comentario=erro#comentar`);
    return new Response(null, { status: 303, headers });
  }

  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    name,
    email,
    content,
    approved: false,
  });

  headers.set('Location', `${target}?comentario=${error ? 'erro' : 'enviado'}#comentarios`);
  return new Response(null, { status: 303, headers });
};
