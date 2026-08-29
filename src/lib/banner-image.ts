const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const extensions: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };

export async function uploadBannerImage(supabase: any, value: FormDataEntryValue | null, variant: 'desktop' | 'mobile') {
  if (!(value instanceof File) || value.size === 0) return { url: null, error: null };
  if (!allowedTypes.has(value.type)) return { url: null, error: 'formato' };
  if (value.size > 8 * 1024 * 1024) return { url: null, error: 'tamanho' };
  const path = `${new Date().getUTCFullYear()}/${variant}-${crypto.randomUUID()}.${extensions[value.type]}`;
  const { error } = await supabase.storage.from('home-banners').upload(path, value, { contentType: value.type, cacheControl: '31536000' });
  if (error) { console.error('[banner] Upload error:', error.message); return { url: null, error: 'upload' }; }
  return { url: supabase.storage.from('home-banners').getPublicUrl(path).data.publicUrl, error: null };
}
