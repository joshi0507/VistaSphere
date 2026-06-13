import path from 'path';
import fs from 'fs/promises';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const QR_DIR = path.join(process.cwd(), 'public', 'qr');

export async function ensureDirectories() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.mkdir(QR_DIR, { recursive: true });
}

export async function saveGLBFile(
  buffer: Buffer,
  slug: string
): Promise<string> {
  await ensureDirectories();
  const filename = `${slug}.glb`;
  const filepath = path.join(UPLOADS_DIR, filename);
  await fs.writeFile(filepath, buffer);
  return `/uploads/${filename}`;
}

export async function deleteFile(relativePath: string) {
  const filepath = path.join(process.cwd(), 'public', relativePath);
  try {
    await fs.unlink(filepath);
  } catch {
    // File might not exist
  }
}
