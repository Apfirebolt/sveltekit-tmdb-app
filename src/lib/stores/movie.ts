// src/lib/stores/movieStore.ts
import { writable } from 'svelte/store';
import apiClient from '$lib/plugins/interceptor';
import type { Movie, MovieResponse } from '$lib/types/movie';

function createMovieStore() {
    const { subscribe, set, update } = writable({
        movies: [] as Movie[],
        totalPages: 0,
        totalResults: 0,
        page: 0,
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

    const getPopularMovies = async (page: number): Promise<void> => {
        update((state) => ({ ...state, loading: true, error: null }));
        try {
            const response = await apiClient.get<MovieResponse>(`movie/popular?api_key=${import.meta.env.VITE_APP_KEY}&page=${page}`);
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

    const getTopRatedMovies = async (page: number): Promise<void> => {
        update((state) => ({ ...state, loading: true, error: null }));
        try {
            const response = await apiClient.get<MovieResponse>(`movie/top_rated?api_key=${import.meta.env.VITE_APP_KEY}&page=${page}`);
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

    const getNowPlayingMovies = async (page: number): Promise<void> => {
        update((state) => ({ ...state, loading: true, error: null }));
        try {
            const response = await apiClient.get<MovieResponse>(`movie/now_playing?api_key=${import.meta.env.VITE_APP_KEY}&page=${page}`);
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

    const getUpcomingMovies = async (page: number): Promise<void> => {
        update((state) => ({ ...state, loading: true, error: null }));
        try {
            const response = await apiClient.get<MovieResponse>(`movie/upcoming?api_key=${import.meta.env.VITE_APP_KEY}&page=${page}`);
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
        searchMovies,
        getPopularMovies,
        getTopRatedMovies,
        getNowPlayingMovies,
        getUpcomingMovies,
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

export const movieStore = createMovieStore();