// src/lib/stores/showStore.ts
import { writable } from 'svelte/store';
import apiClient from '$lib/plugins/interceptor';
import type { TVShow, TVShowResponse } from '$lib/types/Show';

function createShowStore() {
    const { subscribe, set, update } = writable({
        shows: [] as TVShow[],
        totalPages: 0,
        totalResults: 0,
        page: 0,
        loading: false as boolean,
        error: null,
    });

    const searchShows = async (search: string, page: number): Promise<void> => {
        update((state) => ({ ...state, loading: true, error: null }));
        try {
            const response = await apiClient.get<TVShowResponse>(`search/tv?api_key=${import.meta.env.VITE_APP_KEY}&query=${search}&page=${page}`);
            update((state) => ({
                ...state,
                shows: response.data.results, // Assuming `results` contains the list of shows
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

    const getPopularShows = async (page: number): Promise<void> => {
        update((state) => ({ ...state, loading: true, error: null }));
        try {
            const response = await apiClient.get<TVShowResponse>(`tv/popular?api_key=${import.meta.env.VITE_APP_KEY}&page=${page}`);
            update((state) => ({
                ...state,
                shows: response.data.results, // Assuming `results` contains the list of shows
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

    const getTopRatedShows = async (page: number): Promise<void> => {
        update((state) => ({ ...state, loading: true, error: null }));
        try {
            const response = await apiClient.get<TVShowResponse>(`tv/top_rated?api_key=${import.meta.env.VITE_APP_KEY}&page=${page}`);
            update((state) => ({
                ...state,
                shows: response.data.results, // Assuming `results` contains the list of shows
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
    
    const getAiringTodayShows = async (page: number): Promise<void> => {
        update((state) => ({ ...state, loading: true, error: null }));
        try {
            const response = await apiClient.get<TVShowResponse>(`tv/airing_today?api_key=${import.meta.env.VITE_APP_KEY}&page=${page}`);
            update((state) => ({
                ...state,
                shows: response.data.results, // Assuming `results` contains the list of shows
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

    const getOnTheAirShows = async (page: number): Promise<void> => {
        update((state) => ({ ...state, loading: true, error: null }));
        try {
            const response = await apiClient.get<TVShowResponse>(`tv/on_the_air?api_key=${import.meta.env.VITE_APP_KEY}&page=${page}`);
            update((state) => ({
                ...state,
                shows: response.data.results, // Assuming `results` contains the list of shows
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
        searchShows,
        getPopularShows,
        getTopRatedShows,
        getAiringTodayShows,
        getOnTheAirShows,
    };
}

export const showStore = createShowStore();