import type { APIRoute } from 'astro';
import { createClientFromRequest } from '../../../../lib/supabase';

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

  if (!id) {
    responseHeaders.set('Location', '/admin/posts');
    return new Response(null, { status: 302, headers: responseHeaders });
  }

  await supabase.from('posts').delete().eq('id', id);

  responseHeaders.set('Location', '/admin/posts?excluido=1');
  return new Response(null, { status: 302, headers: responseHeaders });
};
