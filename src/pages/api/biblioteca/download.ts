import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { findPublishedBook } from '../../../data/books';

export const POST: APIRoute = async ({ request }) => {
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'Formato inválido.' }, { status: 415 });
  }
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) {
    return Response.json({ error: 'Origem inválida.' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const name = String(body.name ?? '').trim().replace(/\s+/g, ' ').slice(0, 100);
  const email = String(body.email ?? '').trim().toLowerCase().slice(0, 254);
  const phone = String(body.phone ?? '').replace(/\D/g, '');
  const bookSlug = String(body.bookSlug ?? '').trim();
  const book = findPublishedBook(bookSlug);

  if (String(body.website ?? '').trim()) return Response.json({ ok: true });
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || !/^[1-9]\d{9,10}$/.test(phone) || !book) {
    return Response.json({ error: 'Preencha nome, e-mail e telefone com DDD corretamente.' }, { status: 400 });
  }

  const supabaseUrl = import.meta.env.SUPABASE_URL;
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[biblioteca] Credenciais do Supabase não configuradas.');
    return Response.json({ error: 'Download temporariamente indisponível.' }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error: leadError } = await supabase.from('library_downloads').insert({
    name, email, phone, book_slug: book.slug,
    user_agent: request.headers.get('user-agent')?.slice(0, 500) ?? null,
  });
  if (leadError) {
    console.error('[biblioteca] Erro ao salvar lead:', leadError.message);
    return Response.json({ error: 'Não foi possível liberar o download agora.' }, { status: 500 });
  }

  const { data, error: urlError } = await supabase.storage
    .from('library-books')
    .createSignedUrl(book.storagePath, 120, { download: `${book.slug}.pdf` });
  if (urlError || !data?.signedUrl) {
    console.error('[biblioteca] Erro ao assinar PDF:', urlError?.message);
    return Response.json({ error: 'O arquivo não está disponível no momento.' }, { status: 404 });
  }
  return Response.json({ ok: true, downloadUrl: data.signedUrl });
};
