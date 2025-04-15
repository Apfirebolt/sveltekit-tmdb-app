// src/routes/movies/[id]/+page.server.ts

import type { PageServerLoad } from './$types';
import type { Movie } from '$lib/types/Movie';


export const load: PageServerLoad = async ({ params }) => {
    const { id } = params;

    try {
        const response = await fetch(`https://softgenie.org/api/movies/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const movie: Movie = await response.json();
        return { movie }; // Return movie details to the page
    } catch (error) {
        console.error('API Error:', error);
        return { movie: null }; // Handle errors gracefully
    }
};
