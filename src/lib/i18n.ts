export const locales = ['pt-BR', 'es', 'en'] as const;

export type Locale = (typeof locales)[number];

export const localeOptions: Array<{ value: Locale; label: string }> = [
  { value: 'pt-BR', label: 'PT-BR' },
  { value: 'es', label: 'ES' },
  { value: 'en', label: 'EN' },
];

export const localeNames: Record<Locale, string> = {
  'pt-BR': 'Português (Brasil)',
  es: 'Español',
  en: 'English',
};

export const copy: Record<Locale, {
  language: string;
  home: string;
  articles: string;
  library: string;
  contact: string;
  exploreArticles: string;
  contactLink: string;
  heroEyebrow: string;
  heroTitleFirst: string;
  heroTitleSecond: string;
  heroDescription: string;
  feedLabel: string;
  latestArticles: string;
  allArticles: string;
  readArticle: string;
  readNow: string;
  previous: string;
  next: string;
  page: string;
  publishedArticle: string;
  publishedArticles: string;
  noArticles: string;
  backToArticles: string;
  comments: string;
  conversation: string;
  joinDiscussion: string;
  leaveComment: string;
  allFieldsRequired: string;
  name: string;
  email: string;
  notPublished: string;
  comment: string;
  moderation: string;
  sendComment: string;
  commentSent: string;
  commentInvalid: string;
  commentError: string;
  sponsored: string;
  sponsoredBy: string;
  translationFallback: string;
}> = {
  'pt-BR': {
    language: 'Idioma', home: 'Início', articles: 'Artigos', library: 'Biblioteca', contact: 'Contato',
    exploreArticles: 'Explorar artigos', contactLink: 'Entrar em contato', heroEyebrow: 'Sinal aberto / 2026',
    heroTitleFirst: 'Ideias que', heroTitleSecond: 'movem o agora.', heroDescription: 'Um espaço independente para decodificar tecnologia, cultura e as transformações do nosso tempo.',
    feedLabel: 'Feed / Atualizações', latestArticles: 'Últimos artigos',
    allArticles: 'Ver arquivo completo', readArticle: 'Ler artigo', readNow: 'Ler agora', previous: 'Anterior',
    next: 'Próxima', page: 'Página', publishedArticle: 'artigo publicado', publishedArticles: 'artigos publicados',
    noArticles: 'Nenhum artigo publicado ainda.', backToArticles: 'Voltar para artigos', comments: 'Comentários',
    conversation: 'Conversa', joinDiscussion: 'Participe com respeito e contribua para a discussão.',
    leaveComment: 'Deixe um comentário', allFieldsRequired: 'Todos os campos são obrigatórios', name: 'Nome',
    email: 'E-mail', notPublished: 'não será publicado', comment: 'Comentário',
    moderation: 'Ao enviar, você concorda com a moderação do conteúdo.', sendComment: 'Enviar comentário',
    commentSent: 'Comentário enviado. Ele aparecerá após a moderação.',
    commentInvalid: 'Revise os campos. O comentário deve ter entre 3 e 2.000 caracteres.',
    commentError: 'Não foi possível enviar agora. Tente novamente em instantes.', sponsored: 'Patrocinado',
    sponsoredBy: 'por', translationFallback: 'Este artigo ainda não foi traduzido para este idioma.',
  },
  es: {
    language: 'Idioma', home: 'Inicio', articles: 'Artículos', library: 'Biblioteca', contact: 'Contacto',
    exploreArticles: 'Explorar artículos', contactLink: 'Ponte en contacto', heroEyebrow: 'Señal abierta / 2026',
    heroTitleFirst: 'Ideas que', heroTitleSecond: 'mueven el ahora.', heroDescription: 'Un espacio independiente para descifrar la tecnología, la cultura y las transformaciones de nuestro tiempo.',
    feedLabel: 'Feed / Actualizaciones', latestArticles: 'Últimos artículos',
    allArticles: 'Ver archivo completo', readArticle: 'Leer artículo', readNow: 'Leer ahora', previous: 'Anterior',
    next: 'Siguiente', page: 'Página', publishedArticle: 'artículo publicado', publishedArticles: 'artículos publicados',
    noArticles: 'Todavía no hay artículos publicados.', backToArticles: 'Volver a los artículos', comments: 'Comentarios',
    conversation: 'Conversación', joinDiscussion: 'Participa con respeto y contribuye a la discusión.',
    leaveComment: 'Deja un comentario', allFieldsRequired: 'Todos los campos son obligatorios', name: 'Nombre',
    email: 'Correo electrónico', notPublished: 'no se publicará', comment: 'Comentario',
    moderation: 'Al enviar, aceptas la moderación del contenido.', sendComment: 'Enviar comentario',
    commentSent: 'Comentario enviado. Aparecerá después de la moderación.',
    commentInvalid: 'Revisa los campos. El comentario debe tener entre 3 y 2.000 caracteres.',
    commentError: 'No se pudo enviar ahora. Inténtalo de nuevo en unos instantes.', sponsored: 'Patrocinado',
    sponsoredBy: 'por', translationFallback: 'Este artículo todavía no está traducido a este idioma.',
  },
  en: {
    language: 'Language', home: 'Home', articles: 'Articles', library: 'Library', contact: 'Contact',
    exploreArticles: 'Explore articles', contactLink: 'Get in touch', heroEyebrow: 'Open signal / 2026',
    heroTitleFirst: 'Ideas that', heroTitleSecond: 'move the present.', heroDescription: 'An independent space for decoding technology, culture, and the transformations shaping our time.',
    feedLabel: 'Feed / Updates', latestArticles: 'Latest articles',
    allArticles: 'View full archive', readArticle: 'Read article', readNow: 'Read now', previous: 'Previous',
    next: 'Next', page: 'Page', publishedArticle: 'published article', publishedArticles: 'published articles',
    noArticles: 'No articles published yet.', backToArticles: 'Back to articles', comments: 'Comments',
    conversation: 'Conversation', joinDiscussion: 'Join the conversation with respect and contribute to the discussion.',
    leaveComment: 'Leave a comment', allFieldsRequired: 'All fields are required', name: 'Name',
    email: 'Email', notPublished: 'will not be published', comment: 'Comment',
    moderation: 'By submitting, you agree to content moderation.', sendComment: 'Submit comment',
    commentSent: 'Comment submitted. It will appear after moderation.',
    commentInvalid: 'Review the fields. The comment must be between 3 and 2,000 characters.',
    commentError: 'We could not send it right now. Please try again shortly.', sponsored: 'Sponsored',
    sponsoredBy: 'by', translationFallback: 'This article has not been translated into this language yet.',
  },
};

export function getLocale(value: URL | string | null | undefined): Locale {
  const raw = value instanceof URL
    ? value.searchParams.get('lang')
    : new URL(value || 'https://vortice.local').searchParams.get('lang');

  return raw === 'es' || raw === 'en' ? raw : 'pt-BR';
}

export function localeFromValue(value: string | null | undefined): Locale {
  return value === 'es' || value === 'en' ? value : 'pt-BR';
}

export function switchLocale(url: URL, locale: Locale): string {
  const next = new URL(url.toString());
  if (locale === 'pt-BR') next.searchParams.delete('lang');
  else next.searchParams.set('lang', locale);
  return `${next.pathname}${next.search}${next.hash}`;
}

export function localizedPath(path: string, locale: Locale): string {
  const next = new URL(path, 'https://vortice.local');
  if (locale === 'pt-BR') next.searchParams.delete('lang');
  else next.searchParams.set('lang', locale);
  return `${next.pathname}${next.search}${next.hash}`;
}

export function dateLocale(locale: Locale): string {
  return locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR';
}

export function formatDate(value: string, locale: Locale, options: Intl.DateTimeFormatOptions = {
  day: '2-digit', month: 'long', year: 'numeric',
}): string {
  return new Date(value).toLocaleDateString(dateLocale(locale), options);
}

export interface LocalizedPost {
  title: string;
  excerpt: string | null;
  content: string | null;
  translated: boolean;
}

export function localizePost(post: {
  title: string;
  excerpt?: string | null;
  content?: string | null;
  title_es?: string | null;
  excerpt_es?: string | null;
  content_es?: string | null;
  title_en?: string | null;
  excerpt_en?: string | null;
  content_en?: string | null;
}, locale: Locale): LocalizedPost {
  if (locale === 'es' && post.title_es) {
    return {
      title: post.title_es,
      excerpt: post.excerpt_es || post.excerpt || null,
      content: post.content_es || post.content || null,
      translated: Boolean(post.content_es),
    };
  }

  if (locale === 'en' && post.title_en) {
    return {
      title: post.title_en,
      excerpt: post.excerpt_en || post.excerpt || null,
      content: post.content_en || post.content || null,
      translated: Boolean(post.content_en),
    };
  }

  return { title: post.title, excerpt: post.excerpt || null, content: post.content || null, translated: locale === 'pt-BR' };
}
