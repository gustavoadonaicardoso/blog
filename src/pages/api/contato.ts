import type { APIRoute } from 'astro';
import { createClientFromRequest } from '../../lib/supabase';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers();
  const supabase = createClientFromRequest(request, responseHeaders);

  let name: string, email: string, message: string;

  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    const body = await request.json();
    name = body.name;
    email = body.email;
    message = body.message;
  } else {
    const form = await request.formData();
    name = form.get('name') as string;
    email = form.get('email') as string;
    message = form.get('message') as string;
  }

  if (!name || !email || !message) {
    responseHeaders.set('Location', '/contato?erro=campos');
    return new Response(null, { status: 302, headers: responseHeaders });
  }

  const { error: dbError } = await supabase
    .from('contact_messages')
    .insert({ name, email, message });

  if (dbError) {
    console.error('DB error:', dbError);
    responseHeaders.set('Location', '/contato?erro=db');
    return new Response(null, { status: 302, headers: responseHeaders });
  }

  // Send email notification via Resend
  const resendKey = import.meta.env.RESEND_API_KEY;
  const emailFrom = import.meta.env.EMAIL_FROM ?? 'noreply@vortice.blog';
  const adminEmail = import.meta.env.ADMIN_EMAIL;

  if (resendKey && adminEmail) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: emailFrom,
        to: adminEmail,
        subject: `Nova mensagem de contato — ${name}`,
        html: `
          <h2>Nova mensagem de contato</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Mensagem:</strong></p>
          <blockquote>${message.replace(/\n/g, '<br>')}</blockquote>
        `,
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
    }
  }

  responseHeaders.set('Location', '/contato?ok=1');
  return new Response(null, { status: 302, headers: responseHeaders });
};
