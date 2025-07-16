import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// The POST function now accepts a 'params' object
export async function POST(
  request: Request,
  { params }: { params: { key: string } }
) {
  const { key } = params; // Extract the key from the URL
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `${process.env.API_SECRET_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    await kv.set(key, body); // Use the dynamic key here
    return NextResponse.json({ message: `Data stored successfully for key: ${key}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to store data.' }, { status: 500 });
  }
}

// The GET function also accepts the 'params' object
export async function GET(
  request: Request, // The request object is still available if needed
  { params }: { params: { key: string } }
) {
  const { key } = params; // Extract the key from the URL

  try {
    const data = await kv.get(key); // Use the dynamic key here
    if (data === null) {
      return NextResponse.json({ message: `No data found for key: ${key}` }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to retrieve data.' }, { status: 500 });
  }
}