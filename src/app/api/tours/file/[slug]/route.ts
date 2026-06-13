import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Tour from '@/models/Tour';
import { getGLBStreamFromGridFS } from '@/lib/gridfs';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await connectToDatabase();

    // Ensure tour exists (also validates slug)
    const tour = await Tour.findOne({ slug }).lean();
    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    const { stream, contentType } = await getGLBStreamFromGridFS({ slug });

    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': contentType || 'model/gltf-binary',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('GLB stream error:', error);
    return NextResponse.json({ error: 'Failed to stream GLB' }, { status: 500 });
  }
}
