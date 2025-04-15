// src/routes/shows/[id]/+page.server.ts

import type { PageServerLoad } from './$types';
import type { DetailedTVShow } from '$lib/types/Show';
import apiClient from '$lib/plugins/interceptor';

export const load: PageServerLoad = async ({ params }) => {
    const { id } = params;

    try {
        const response = await apiClient.get(`tv/${id}?api_key=${import.meta.env.VITE_APP_KEY}`);
        const show: DetailedTVShow = response.data;
        return {
            show,
        };
    } catch (error) {
        console.error('Error fetching show details:', error);
        throw error; // Rethrow the error to handle it in the route
    }
};
