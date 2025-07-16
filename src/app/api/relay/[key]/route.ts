import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// The context object's type, containing the dynamic route parameters
type RouteContext = {
  params: {
    key: string;
  };
};

export async function POST(request: Request, context: RouteContext) {
  // Extract the key from the context object
  const { key } = context.params;
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

export async function GET(request: Request, context: RouteContext) {
  // Extract the key from the context object
  const { key } = context.params;

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