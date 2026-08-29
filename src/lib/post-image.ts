const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const extensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

export type ImageUploadResult = { url: string | null; error: string | null };

export async function uploadPostImage(supabase: any, value: FormDataEntryValue | null): Promise<ImageUploadResult> {
  if (!(value instanceof File) || value.size === 0) return { url: null, error: null };
  if (!allowedTypes.has(value.type)) return { url: null, error: 'formato-imagem' };
  if (value.size > 8 * 1024 * 1024) return { url: null, error: 'tamanho-imagem' };

  const path = `${new Date().getUTCFullYear()}/${crypto.randomUUID()}.${extensions[value.type]}`;
  const { error } = await supabase.storage.from('post-images').upload(path, value, {
    contentType: value.type,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) {
    console.error('[post-image] Upload error:', error.message);
    return { url: null, error: 'upload-imagem' };
  }

  const { data } = supabase.storage.from('post-images').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
