import createBookGenerator from '"@/lib/bookGenerator"';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const seed = searchParams.get('seed') || 'default-seed';
  const region = searchParams.get('region') || 'en_US';
  const avgLikes = parseFloat(searchParams.get('avgLikes') || '3.5');
  const avgReviews = parseFloat(searchParams.get('avgReviews') || '2.0');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  const startIndex = (page - 1) * pageSize + 1;

  try {
    const bookGenerator = createBookGenerator(seed, region, avgLikes, avgReviews);
    const books = bookGenerator.generateBooks(pageSize, startIndex);

    return NextResponse.json({
      books,
      page,
      pageSize,
      metadata: {
        seed,
        region,
        avgLikes,
        avgReviews
      }
    });
  } catch (error) {
    console.error('Error generating books:', error);
    return NextResponse.json({ error: 'Failed to generate books' }, { status: 500 });
  }
}