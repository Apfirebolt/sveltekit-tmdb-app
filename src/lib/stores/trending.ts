// src/lib/stores/trendingStore.ts
import { writable } from 'svelte/store';
import apiClient from '$lib/plugins/interceptor';
import type { Movie, MovieResponse } from '$lib/types/Movie';

function createTrendingStore() {
    const { subscribe, set, update } = writable({
        movies: [] as Movie[],
        totalPages: 0,
        totalResults: 0,
        page: 0,
        loading: false as boolean,
        error: null,
    });

    const getTrendingMovies = async (timeWindow: 'day' | 'week', page: number): Promise<void> => {
        update((state) => ({ ...state, loading: true, error: null }));
        try {
            const response = await apiClient.get<MovieResponse>(`trending/movie/${timeWindow}?api_key=${import.meta.env.VITE_APP_KEY}&page=${page}`);
            update((state) => ({
                ...state,
                movies: response.data.results, // Assuming `results` contains the list of movies
                totalPages: response.data.total_pages,
                totalResults: response.data.total_results,
                page: response.data.page,
                loading: false,
            }));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            update((state) => ({
                ...state,
                loading: false,
                error: errorMessage,
            }));
        }
    };

    return {
        subscribe,
        set,
        update,
        getTrendingMovies,
        reset: () => set({
            movies: [],
            totalPages: 0,
            totalResults: 0,
            page: 0,
            loading: false,
            error: null,
        }),
    };
}

export const trendingStore = createTrendingStore();
