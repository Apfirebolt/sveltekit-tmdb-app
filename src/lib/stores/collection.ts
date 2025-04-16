// src/lib/stores/collectionStore.ts
import { writable } from 'svelte/store';
import apiClient from '$lib/plugins/interceptor';
import type { Collection, Result } from '$lib/types/Collection';

function createCollectionStore() {
    const { subscribe, set, update } = writable({
        collections: [] as Result[],
        totalPages: 0,
        totalResults: 0,
        page: 0,
        loading: false as boolean,
        error: null,
    });

    const searchCollections = async (search: string, page: number): Promise<void> => {
        update((state) => ({ ...state, loading: true, error: null }));
        try {
            const response = await apiClient.get<Collection>(`search/collection?api_key=${import.meta.env.VITE_APP_KEY}&query=${search}&page=${page}`);
            update((state) => ({
                ...state,
                collections: response.data.results, // Assuming `results` contains the list of collections
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
        searchCollections,
    };
}

export const collectionStore = createCollectionStore();