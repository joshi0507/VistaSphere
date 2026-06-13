import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Tour from '@/models/Tour';
import { generateUniqueSlug, formatTitle } from '@/lib/slug';
import { uploadGLBToGridFS } from '@/lib/gridfs';
import QRCode from 'qrcode';

const MAX_FILE_SIZE = 500 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.glb')) {
      return NextResponse.json({ error: 'Only GLB files are supported' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 500MB' }, { status: 400 });
    }

    await connectToDatabase();

    const slug = await generateUniqueSlug(file.name);
    const title = formatTitle(slug);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { gridfsFileId } = await uploadGLBToGridFS({
      buffer,
      slug,
      fileName: file.name,
    });

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;
    const tourUrl = `${baseUrl}/tour/${slug}`;

    const qrBuffer = await QRCode.toBuffer(tourUrl, {
      width: 400,
      margin: 2,
      color: { dark: '#0a0a0a', light: '#ffffff' },
    });
    const qrCodeBase64 = `data:image/png;base64,${qrBuffer.toString('base64')}`;

    const tour = await Tour.create({
      title,
      slug,
      fileUrl: `/api/tours/file/${slug}`,
      fileName: file.name,
      fileSizeBytes: file.size,
      qrUrl: qrCodeBase64,
      qrCodeBase64,
      description: `Explore ${title} in an immersive 360° virtual experience.`,
      gridfsFileId,
    });

    return NextResponse.json({
      success: true,
      tour: {
        id: (tour as any)._id,
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