import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Tour from '@/models/Tour';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectToDatabase();

    const tour = await Tour.findOne({ slug });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json({ tour });
  } catch (error) {
    console.error('Tour fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch tour' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    await connectToDatabase();

    const inc: Record<string, number> = {};

    if (body.incrementView) {
      inc.viewCount = (inc.viewCount || 0) + 1;

      // Track device type
      const ua = request.headers.get('user-agent') || '';
      if (/mobile/i.test(ua)) {
        inc['deviceStats.mobile'] = (inc['deviceStats.mobile'] || 0) + 1;
      } else if (/tablet/i.test(ua)) {
        inc['deviceStats.tablet'] = (inc['deviceStats.tablet'] || 0) + 1;
      } else {
        inc['deviceStats.desktop'] = (inc['deviceStats.desktop'] || 0) + 1;
      }
    }

    if (body.incrementScan) {
      inc.scanCount = (inc.scanCount || 0) + 1;
    }

    const update = Object.keys(inc).length ? { $inc: inc } : {};

    const tour = await Tour.findOneAndUpdate({ slug }, update, { returnDocument: 'after' });


    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json({ tour });
  } catch (error) {
    console.error('Tour update error:', error);
    return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 });
  }
}
