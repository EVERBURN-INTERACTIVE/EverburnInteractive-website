import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/lib/supabase/types';

export const PROFILE_PHOTO_BUCKET = 'profile-photos';
export const PROFILE_PHOTO_MAX_EDGE = 1000;
export const PROFILE_PHOTO_MAX_BYTES = 1_048_576;

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png']);

export function profilePhotoObjectPath(userId: string, mimeType: string): string {
  const ext = mimeType === 'image/png' ? 'png' : 'jpg';
  return `${userId}/avatar.${ext}`;
}

function normalizeProfilePhotoType(file: File): string {
  if (file.type === 'image/jpg' || file.type === 'image/pjpeg') {
    return 'image/jpeg';
  }
  if (ALLOWED_TYPES.has(file.type)) {
    return file.type;
  }
  const name = file.name.toLowerCase();
  if (name.endsWith('.png')) {
    return 'image/png';
  }
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) {
    return 'image/jpeg';
  }
  return file.type;
}

async function readImageSize(file: File): Promise<{ width: number; height: number } | null> {
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(file).catch(() => null);
    if (!bitmap) {
      return null;
    }
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  }

  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    image.src = url;
  });
}

export async function validateProfilePhoto(file: File): Promise<string | null> {
  const type = normalizeProfilePhotoType(file);
  if (!ALLOWED_TYPES.has(type)) {
    return 'Use a PNG or JPG image.';
  }
  if (file.size > PROFILE_PHOTO_MAX_BYTES) {
    return 'Keep the file at 1MB or smaller.';
  }

  const size = await readImageSize(file);
  if (!size) {
    return 'That file could not be read as an image.';
  }
  if (size.width > PROFILE_PHOTO_MAX_EDGE || size.height > PROFILE_PHOTO_MAX_EDGE) {
    return `Keep the image at ${PROFILE_PHOTO_MAX_EDGE}x${PROFILE_PHOTO_MAX_EDGE} pixels or smaller.`;
  }
  return null;
}

export async function uploadProfilePhoto(
  supabase: SupabaseClient<Database>,
  userId: string,
  file: File,
): Promise<string> {
  const type = normalizeProfilePhotoType(file);
  const path = profilePhotoObjectPath(userId, type);
  const otherPath = type === 'image/png'
    ? profilePhotoObjectPath(userId, 'image/jpeg')
    : profilePhotoObjectPath(userId, 'image/png');

  const { error: uploadError } = await supabase.storage
    .from(PROFILE_PHOTO_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: type,
      cacheControl: '0',
    });
  if (uploadError) {
    throw uploadError;
  }

  await supabase.storage.from(PROFILE_PHOTO_BUCKET).remove([otherPath]);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ custom_avatar_path: path })
    .eq('user_id', userId);
  if (updateError) {
    throw updateError;
  }

  return path;
}

export async function removeProfilePhoto(
  supabase: SupabaseClient<Database>,
  userId: string,
  currentPath: string | null,
): Promise<void> {
  const paths = currentPath
    ? [currentPath]
    : [
        profilePhotoObjectPath(userId, 'image/png'),
        profilePhotoObjectPath(userId, 'image/jpeg'),
      ];
  await supabase.storage.from(PROFILE_PHOTO_BUCKET).remove(paths);
  const { error } = await supabase
    .from('profiles')
    .update({ custom_avatar_path: null })
    .eq('user_id', userId);
  if (error) {
    throw error;
  }
}

export async function createProfilePhotoUrl(
  supabase: SupabaseClient<Database>,
  path: string,
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(PROFILE_PHOTO_BUCKET)
    .createSignedUrl(path, 3600);
  if (error) {
    return null;
  }
  return data.signedUrl;
}
