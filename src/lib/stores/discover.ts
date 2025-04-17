// src/lib/stores/discoverStore.ts
import { writable } from 'svelte/store';
import apiClient from '$lib/plugins/interceptor';
import type { DiscoverResponse, MovieResult } from '$lib/types/Discover';

function createDiscoverStore() {
    const { subscribe, set, update } = writable({
        items: [] as MovieResult[],
        totalPages: 0,
        totalResults: 0,
        page: 0,
        loading: false as boolean,
        error: null,
    });

    const fetchDiscoverItems = async (category: string, page: number): Promise<void> => {
        update((state) => ({ ...state, loading: true, error: null }));
        try {
            const response = await apiClient.get<DiscoverResponse>(`discover/${category}?api_key=${import.meta.env.VITE_APP_KEY}&page=${page}`);
            update((state) => ({
                ...state,
                items: response.data.results, // Assuming `results` contains the list of discovered items
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
        fetchDiscoverItems,
    };
}

export const discoverStore = createDiscoverStore();