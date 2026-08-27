import type { APIRoute } from 'astro';
import { createClientFromRequest } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'Formato inválido.' }, { status: 415 });
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: 'Origem inválida.' }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  const name = String(body.name ?? '').trim().slice(0, 100);
  const email = String(body.email ?? '').trim().toLowerCase().slice(0, 254);
  const whatsapp = String(body.whatsapp ?? '').replace(/[^+\d]/g, '').slice(0, 20);
  const consent = body.consent === true;
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || whatsapp.length < 10 || !consent) {
    return Response.json({ error: 'Preencha os dados e aceite a autorização.' }, { status: 400 });
  }
  const consentText = 'Autorizo o Vórtice a enviar newsletter, conteúdo e ofertas por e-mail e WhatsApp. Posso cancelar a qualquer momento.';
  const supabase = createClientFromRequest(request, new Headers());
  const { error } = await supabase.from('marketing_leads').insert({
    name, email, whatsapp, marketing_consent: true, consent_text: consentText,
    consented_at: new Date().toISOString(), source: 'newsletter_popup',
  });
  if (error?.code === '23505') return Response.json({ error: 'Este e-mail já está cadastrado.' }, { status: 409 });
  if (error) { console.error('[newsletter] DB error:', error.message); return Response.json({ error: 'Não foi possível concluir agora.' }, { status: 500 }); }
  return Response.json({ ok: true });
};
