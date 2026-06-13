import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Tour from '@/models/Tour';
import { generateUniqueSlug, formatTitle } from '@/lib/slug';
import { uploadGLBToGridFS } from '@/lib/gridfs';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs/promises';

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.glb')) {
      return NextResponse.json({ error: 'Only GLB files are supported' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 500MB' }, { status: 400 });
    }

    await connectToDatabase();

    // Generate unique slug
    const slug = await generateUniqueSlug(file.name);
    const title = formatTitle(slug);

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save GLB file into GridFS (no disk writes)
    const { contentType } = { contentType: 'model/gltf-binary' };
    const { gridfsFileId } = await uploadGLBToGridFS({
      buffer,
      slug,
      fileName: file.name,
    });

    // Stream URL from our GridFS-backed endpoint
    const fileUrl = `/api/tours/file/${slug}`;

    // Generate QR code
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;
    const tourUrl = `${baseUrl}/tour/${slug}`;

    const qrDir = path.join(process.cwd(), 'public', 'qr');
    await fs.mkdir(qrDir, { recursive: true });
    const qrFilename = `${slug}.png`;
    const qrFilepath = path.join(qrDir, qrFilename);

    await QRCode.toFile(qrFilepath, tourUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0a0a0a',
        light: '#ffffff',
      },
    });

    const qrUrl = `/qr/${qrFilename}`;

    // Save tour to database
    const tour = await Tour.create({
      title,
      slug,
      fileUrl,
      fileName: file.name,
      fileSizeBytes: file.size,
      qrUrl,
      description: `Explore ${title} in an immersive 360° virtual experience.`,
    });

    return NextResponse.json({
      success: true,
      tour: {
        id: tour._id,
        title: tour.title,
        slug: tour.slug,
        fileUrl: tour.fileUrl,
        qrUrl: tour.qrUrl,
        tourUrl,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}


