import slugify from 'slugify';
import Tour from '@/models/Tour';

export function generateSlugFromFilename(filename: string): string {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  return slugify(nameWithoutExt, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export async function generateUniqueSlug(filename: string): Promise<string> {
  const baseSlug = generateSlugFromFilename(filename);
  
  // Check if slug exists
  const existing = await Tour.findOne({ slug: baseSlug });
  if (!existing) return baseSlug;
  
  // Find next available number
  let counter = 2;
  while (true) {
    const slug = `${baseSlug}-${counter}`;
    const exists = await Tour.findOne({ slug });
    if (!exists) return slug;
    counter++;
  }
}

export function formatTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
