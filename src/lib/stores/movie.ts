// src/lib/stores/movieStore.ts
import { writable } from 'svelte/store';
import apiClient from '$lib/plugins/interceptor';
import type { Movie, MovieResponse } from '$lib/types/movie';

function createMovieStore() {
    const { subscribe, set, update } = writable({
        movies: [] as Movie[],
        loading: false as boolean,
        error: null,
    });

    const searchMovies = async (search: string, page: number): Promise<void> => {
        update((state) => ({ ...state, loading: true, error: null }));
        try {
            const response = await apiClient.get<MovieResponse>(`search/movie?api_key=${import.meta.env.VITE_APP_KEY}&query=${search}&page=${page}`);
            update((state) => ({
                ...state,
                movies: response.data.results, // Assuming `results` contains the list of movies
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
        searchMovies, // Expose the fetch function
    };
}

export const movieStore = createMovieStore();