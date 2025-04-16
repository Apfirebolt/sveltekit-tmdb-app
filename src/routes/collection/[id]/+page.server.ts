// src/routes/movies/[id]/+page.server.ts

import type { PageServerLoad } from './$types';
import type { DetailedMovie } from '$lib/types/Movie';
import apiClient from '$lib/plugins/interceptor';


export const load: PageServerLoad = async ({ params }) => {
    const { id } = params;

    try {
        const response = await apiClient.get(`movie/${id}?api_key=${import.meta.env.VITE_APP_KEY}`);
        const movie: DetailedMovie = response.data;
        return {
            movie,
        };
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error; // Rethrow the error to handle it in the route
    }
};
