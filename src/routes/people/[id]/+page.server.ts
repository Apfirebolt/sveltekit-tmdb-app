// src/routes/people/[id]/+page.server.ts

import type { PageServerLoad } from './$types';
import type { DetailedPerson } from '$lib/types/people';
import apiClient from '$lib/plugins/interceptor';

export const load: PageServerLoad = async ({ params }) => {
    const { id } = params;

    try {
        const response = await apiClient.get(`person/${id}?api_key=${import.meta.env.VITE_APP_KEY}`);
        const person: DetailedPerson = response.data;
        return {
            person,
        };
    } catch (error) {
        console.error('Error fetching person details:', error);
        throw error; // Rethrow the error to handle it in the route
    }
};
