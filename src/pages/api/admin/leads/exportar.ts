import type { APIRoute } from 'astro';
import { createClientFromRequest } from '../../../../lib/supabase';

const csv = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
export const GET: APIRoute = async ({ request }) => {
  const headers = new Headers();
  const supabase = createClientFromRequest(request, headers);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return new Response(null, { status: 302, headers: { Location: '/admin/login' } });
  const { data: leads } = await supabase.from('marketing_leads').select('name,email,whatsapp,consented_at,source').is('unsubscribed_at', null).order('created_at', { ascending: false });
  const rows = [['Nome', 'Email', 'WhatsApp', 'Consentimento', 'Origem'].map(csv).join(',')];
  for (const lead of leads ?? []) rows.push([lead.name, lead.email, lead.whatsapp, lead.consented_at, lead.source].map(csv).join(','));
  return new Response(`\uFEFF${rows.join('\n')}`, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="leads-vortice.csv"' } });
};
