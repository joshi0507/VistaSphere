import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import Tour from '@/models/Tour';
import TourPageClient from './TourPageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    await connectToDatabase();
    const tour = await Tour.findOne({ slug });

    if (!tour) {
      return { title: 'Tour Not Found' };
    }

    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') || headersList.get('host') || 'localhost:3000';
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    return {
      title: `${tour.title} — Virtual Tour`,
      description: tour.description || `Explore ${tour.title} in an immersive 360° virtual experience.`,
      openGraph: {
        title: `${tour.title} — Virtual Tour`,
        description: `Explore ${tour.title} in an immersive 360° virtual experience.`,
        url: `${baseUrl}/tour/${slug}`,
        type: 'website',
        images: [
          {
            url: `${baseUrl}/api/og?slug=${slug}`,
            width: 1200,
            height: 630,
            alt: `${tour.title} Virtual Tour`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${tour.title} — Virtual Tour`,
        description: `Explore ${tour.title} in an immersive 360° virtual experience.`,
      },
    };
  } catch {
    return { title: 'Virtual Tour' };
  }
}

export default async function TourPage({ params }: Props) {
  const { slug } = await params;

  await connectToDatabase();
  const tour = await Tour.findOne({ slug });

  if (!tour) {
    notFound();
  }

  const tourData = {
    id: tour._id.toString(),
    title: tour.title,
    slug: tour.slug,
    fileUrl: tour.fileUrl,
    qrUrl: tour.qrUrl,
    description: tour.description,
    viewCount: tour.viewCount,
    createdAt: tour.createdAt.toISOString(),
  };

  return <TourPageClient tour={tourData} />;
}
