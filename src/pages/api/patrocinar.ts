import type { APIRoute } from 'astro';
import { createClientFromRequest } from '../../lib/supabase';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers();
  const supabase = createClientFromRequest(request, responseHeaders);

  const form = await request.formData();
  const company_name = form.get('company_name') as string;
  const email = form.get('email') as string;
  const website = (form.get('website') as string) || null;
  const message = (form.get('message') as string) || null;
  const ad_title = (form.get('ad_title') as string) || null;
  const description = (form.get('description') as string) || null;
  const image_url = (form.get('image_url') as string) || null;
  const mobile_image_url = (form.get('mobile_image_url') as string) || null;
  const destination_url = (form.get('destination_url') as string) || null;
  const placement = (form.get('placement') as string) || 'inline';
  const article_slug = (form.get('article_slug') as string) || null;

  if (!company_name || !email) {
    responseHeaders.set('Location', '/patrocinar?erro=campos');
    return new Response(null, { status: 302, headers: responseHeaders });
  }

  const { error: dbError } = await supabase
    .from('sponsor_interests')
    .insert({ company_name, email, website, message });

  if (dbError) {
    console.error('DB error:', dbError);
    responseHeaders.set('Location', '/patrocinar?erro=db');
    return new Response(null, { status: 302, headers: responseHeaders });
  }

  if (ad_title || destination_url || image_url) {
    if (!ad_title || !destination_url || !['inline', 'sticky', 'popup'].includes(placement)) {
      responseHeaders.set('Location', '/patrocinar?erro=anuncio');
      return new Response(null, { status: 302, headers: responseHeaders });
    }
    try {
      const destination = new URL(destination_url);
      if (!['http:', 'https:'].includes(destination.protocol)) throw new Error('URL inválida');
      for (const candidate of [image_url, mobile_image_url]) {
        if (candidate) {
          const image = new URL(candidate);
          if (!['http:', 'https:'].includes(image.protocol)) throw new Error('URL inválida');
        }
      }
    } catch {
      responseHeaders.set('Location', '/patrocinar?erro=url');
      return new Response(null, { status: 302, headers: responseHeaders });
    }
    const { error: campaignError } = await supabase.from('ad_campaigns').insert({
      sponsor_name: company_name, contact_email: email, title: ad_title, description,
      image_url, mobile_image_url, destination_url, placement, article_slug,
      approved: false, active: false,
    });
    if (campaignError) {
      console.error('Campaign DB error:', campaignError);
      responseHeaders.set('Location', '/patrocinar?erro=campanha');
      return new Response(null, { status: 302, headers: responseHeaders });
    }
  }

  const resendKey = import.meta.env.RESEND_API_KEY;
  const emailFrom = import.meta.env.EMAIL_FROM ?? 'noreply@vortice.blog';
  const adminEmail = import.meta.env.ADMIN_EMAIL;

  if (resendKey && adminEmail) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: emailFrom,
        to: adminEmail,
        subject: `Novo interesse de patrocínio — ${company_name}`,
        html: `
          <h2>Novo interesse de patrocínio</h2>
          <p><strong>Empresa:</strong> ${company_name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          ${website ? `<p><strong>Site:</strong> <a href="${website}">${website}</a></p>` : ''}
          ${message ? `<p><strong>Mensagem:</strong></p><blockquote>${message.replace(/\n/g, '<br>')}</blockquote>` : ''}
        `,
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
    }
  }

  responseHeaders.set('Location', '/patrocinar?ok=1');
  return new Response(null, { status: 302, headers: responseHeaders });
};
