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
