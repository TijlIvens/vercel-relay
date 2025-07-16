import { kv } from '@vercel/kv';

export default async function handler(request, response) {
  // The key we will use to store our data in Vercel KV.
  const DATA_KEY = 'my-data';

  // Handle POST request
  if (request.method === 'POST') {
    try {
      // Vercel automatically parses the body for you
      const body = request.body; 
      
      // Store the request body in Vercel KV
      await kv.set(DATA_KEY, body);
      
      return response.status(200).json({ message: 'Data stored successfully.' });

    } catch (error) {
      return response.status(500).json({ error: 'Failed to store data.' });
    }
  }

  // Handle GET request
  if (request.method === 'GET') {
    try {
      // Retrieve the data from Vercel KV
      const data = await kv.get(DATA_KEY);

      if (data === null) {
        return response.status(404).json({ message: 'No data found.' });
      }

      // Return the stored data
      return response.status(200).json(data);

    } catch (error) {
      return response.status(500).json({ error: 'Failed to retrieve data.' });
    }
  }

  // If the method is not POST or GET, return an error
  return response.status(405).send('Method Not Allowed');
}