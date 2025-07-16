import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  // The type for the context object must be defined inline like this:
  context: { params: Promise<{ key: string }> }
) {
  const { key } = await context.params;
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `${process.env.API_SECRET_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    await kv.set(key, body);
    return NextResponse.json({ message: `Data stored successfully for key: ${key}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to store data.' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  // Define the type inline for the GET handler as well:
  context: { params: Promise<{ key: string }> }
) {
  const { key } = await context.params;

  try {
    const data = await kv.get(key);
    if (data === null) {
      return NextResponse.json({ message: `No data found for key: ${key}` }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to retrieve data.' }, { status: 500 });
  }
}