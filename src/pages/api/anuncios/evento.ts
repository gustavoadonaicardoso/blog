import type { APIRoute } from 'astro';
import { createClientFromRequest } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) return new Response(null, { status: 415 });
  const { id, event } = await request.json().catch(() => ({}));
  if (typeof id !== 'string' || !['impression', 'click'].includes(event)) return new Response(null, { status: 400 });
  const supabase = createClientFromRequest(request, new Headers());
  await supabase.rpc('record_ad_event', { campaign_id: id, event_type: event });
  return new Response(null, { status: 204 });
};
