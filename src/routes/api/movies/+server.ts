import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import type { Movie, ApiResponse } from '$lib/types/Movie';

export const GET: RequestHandler = async () => {
  try {
    const response = await fetch('https://softgenie.org/api/movies');
    if (!response.ok) {
      return json({ error: `HTTP error! status: ${response.status}` }, { status: response.status });
    }
    const data: ApiResponse = await response.json();
    return json(data);
  } catch (error) {
    console.error('API Error:', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
};