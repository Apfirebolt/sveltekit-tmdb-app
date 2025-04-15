// src/lib/stores/peopleStore.ts
import { writable } from 'svelte/store';
import apiClient from '$lib/plugins/interceptor';
import type { Person, PersonResponse } from '$lib/types/people';

function createPeopleStore() {
    const { subscribe, set, update } = writable({
        people: [] as Person[],
        totalPages: 0,
        totalResults: 0,
        page: 0,
        loading: false as boolean,
        error: null,
    });

    const searchPeople = async (search: string, page: number): Promise<void> => {
        update((state) => ({ ...state, loading: true, error: null }));
        try {
            const response = await apiClient.get<PersonResponse>(`search/person?api_key=${import.meta.env.VITE_APP_KEY}&query=${search}&page=${page}`);
            update((state) => ({
                ...state,
                people: response.data.results, // Assuming `results` contains the list of people
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
        searchPeople, // Expose the fetch function
    };
}

export const peopleStore = createPeopleStore();