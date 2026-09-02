<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { fly, fade } from 'svelte/transition';
    import apiClient from '$lib/plugins/interceptor';
    import { peopleStore } from '$lib/stores/people';
    import HeaderComponent from '$lib/components/Header.svelte';
    import FooterComponent from '$lib/components/Footer.svelte';
    import Pagination from '$lib/components/Pagination.svelte';
    import Loader from '$lib/components/Loader.svelte';
    import Icon from '@iconify/svelte';

    import type { Person } from '$lib/types/people.ts';
    $: ({ people, loading, totalPages, totalResults, error } = $peopleStore);

    let searchQuery: string = '';
    let currentPage: number = 1;
    let typeAheadSuggestions: string[] = [];
    let showSuggestions: boolean = false;
    let isFetchingSuggestions: boolean = false;
    let showPeople: boolean = false;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let typewriterTimer: ReturnType<typeof setTimeout> | null = null;
    const DEBOUNCE_DELAY = 300;

    $: if (!loading && !error && people.length > 0) {
        showPeople = true;
    } else {
        showPeople = false;
    }

    function goToNextPage() {
        currentPage += 1;
        if (searchQuery.trim() === '') {
            peopleStore.getPopularPeople(currentPage);
        } else {
            peopleStore.searchPeople(searchQuery, currentPage);
        }
    }

    function goToPreviousPage() {
        currentPage -= 1;
        if (currentPage < 1) {
            currentPage = 1;
        }
        if (searchQuery.trim() === '') {
            peopleStore.getPopularPeople(currentPage);
        } else {
            peopleStore.searchPeople(searchQuery, currentPage);
        }
    }

    const goToPersonDetails = (person: Person) => {
        goto(`/people/${person.id}`);
    };

    const text = 'Welcome to TMDB People App';
    let displayedText = '';
    let index = 0;

    const typeWriter = () => {
        if (index < text.length) {
            displayedText += text[index];
            index++;
            typewriterTimer = setTimeout(typeWriter, 85);
        }
    };

    typeWriter();

    const searchPerson = () => {
        if (searchQuery.trim() !== '') {
            peopleStore.searchPeople(searchQuery, 1);
            currentPage = 1;
            showSuggestions = false;
        } else {
            peopleStore.getPopularPeople(1);
            currentPage = 1;
            showSuggestions = false;
        }
    };

    const getTypeAheadSuggestions = async () => {
        if (searchQuery.trim() !== '') {
            isFetchingSuggestions = true;
            try {
                const response = await apiClient.get(
                    `/search/person?query=${encodeURIComponent(searchQuery)}&page=1&api_key=${import.meta.env.VITE_APP_KEY}`
                );
                typeAheadSuggestions = response.data.results.map((person: Person) => person.name);
                showSuggestions = typeAheadSuggestions.length > 0;
            } catch (err) {
                console.error('Error fetching typeahead suggestions:', err);
                typeAheadSuggestions = [];
                showSuggestions = false;
            } finally {
                isFetchingSuggestions = false;
            }
        } else {
            typeAheadSuggestions = [];
            showSuggestions = false;
        }
    };

    const handleInputChange = () => {
        showSuggestions = false;
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(getTypeAheadSuggestions, DEBOUNCE_DELAY);
    };

    const selectSuggestion = (suggestion: string) => {
        searchQuery = suggestion;
        searchPerson();
        showSuggestions = false;
    };

    const handleBlur = () => {
        setTimeout(() => {
            showSuggestions = false;
        }, 150);
    };

    onMount(() => {
        peopleStore.getPopularPeople(currentPage);
    });

    onDestroy(() => {
        if (debounceTimer) clearTimeout(debounceTimer);
        if (typewriterTimer) clearTimeout(typewriterTimer);
    });
</script>

<svelte:head>
    <title>People - Browse Popular People</title>
    <meta
        name="description"
        content="Explore a collection of popular people, including actors, directors, and more. Find your favorite celebrities here!"
    />
</svelte:head>

<HeaderComponent title="People" />

{#if loading}
    <div class="flex min-h-[60vh] items-center justify-center">
        <Loader />
    </div>
{:else if error}
    <div class="container mx-auto px-4 py-16 text-center">
        <div class="mx-auto max-w-md rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <Icon icon="mdi:alert-circle-outline" class="mx-auto mb-3 text-4xl text-red-500" />
            <h2 class="text-lg font-semibold text-red-600">Failed to Load People</h2>
            <p class="mt-1 text-sm text-red-500/90">{error.message}</p>
        </div>
    </div>
{:else}
    <div class="min-h-screen bg-accent text-dark">
        <!-- Hero Search Section -->
        <section
            class="relative flex min-h-[480px] w-full items-center justify-center overflow-visible bg-cover bg-center py-20"
            style="background-image: url('https://img10.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/5313/1734078555313-i');"
        >
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80"></div>

            <div class="relative z-10 mx-auto w-full max-w-3xl px-4 text-center text-light">
                <h1
                    class="mb-3 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
                    in:fly={{ y: 30, duration: 600 }}
                >
                    {displayedText}
                    {#if index < text.length}
                        <span class="animate-pulse">|</span>
                    {/if}
                </h1>
                <p class="mb-8 text-base text-light/80 sm:text-lg">
                    Discover your favorite celebrities, actors, directors, and creators.
                </p>

                <!-- Search Input Bar -->
                <div class="relative mx-auto w-full max-w-2xl">
                    <form
                        class="flex flex-col gap-2 rounded-2xl border border-white/20 bg-light/95 p-2 shadow-2xl backdrop-blur-md transition-all focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/40 sm:flex-row sm:items-center"
                        on:submit|preventDefault={searchPerson}
                    >
                        <div class="relative flex flex-1 items-center">
                            <Icon
                                icon="mdi:magnify"
                                class="pointer-events-none absolute left-3.5 text-xl text-secondary/60"
                            />
                            <input
                                type="text"
                                placeholder="Search actors, directors, writers..."
                                bind:value={searchQuery}
                                on:input={handleInputChange}
                                on:blur={handleBlur}
                                on:focus={() => {
                                    if (typeAheadSuggestions.length > 0) showSuggestions = true;
                                }}
                                class="w-full rounded-xl bg-transparent py-2.5 pr-4 pl-11 text-sm font-medium text-dark placeholder-dark/40 focus:outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isFetchingSuggestions}
                            class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-2.5 text-sm font-semibold text-light shadow-md transition-all duration-150 hover:bg-danger focus:outline-none focus:ring-2 focus:ring-secondary/50 active:scale-95 disabled:opacity-50"
                        >
                            <Icon icon="mdi:magnify" class="text-base" />
                            Search
                        </button>
                    </form>

                    <!-- Suggestions Dropdown -->
                    {#if showSuggestions && typeAheadSuggestions.length > 0}
                        <ul
                            class="absolute top-full right-0 left-0 z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-secondary/15 bg-light py-2 text-left shadow-2xl backdrop-blur-md"
                            transition:fade={{ duration: 150 }}
                        >
                            {#each typeAheadSuggestions as suggestion}
                                <li>
                                    <button
                                        type="button"
                                        class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-dark transition-colors hover:bg-secondary/10 hover:text-secondary focus:bg-secondary/10 focus:outline-none"
                                        on:click={() => selectSuggestion(suggestion)}
                                    >
                                        <Icon icon="mdi:account-search-outline" class="text-base text-secondary/70 shrink-0" />
                                        <span class="truncate">{suggestion}</span>
                                    </button>
                                </li>
                            {/each}
                        </ul>
                    {/if}

                    {#if isFetchingSuggestions && searchQuery.trim() !== ''}
                        <div
                            class="absolute top-full right-0 left-0 z-30 mt-2 flex items-center gap-2 rounded-xl border border-secondary/15 bg-light px-4 py-3 text-xs font-medium text-dark/60 shadow-xl"
                            transition:fade={{ duration: 150 }}
                        >
                            <Icon icon="mdi:loading" class="animate-spin text-base text-secondary" />
                            Loading suggestions...
                        </div>
                    {/if}
                </div>
            </div>
        </section>

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
            {#if people.length > 0}
                <!-- Controls & Stats Bar -->
                <div class="mb-8 flex flex-col items-center justify-between gap-4 border-b border-secondary/15 pb-6 sm:flex-row">
                    <div>
                        <h2 class="text-xl font-bold tracking-tight text-dark sm:text-2xl">
                            {searchQuery ? `Results for "${searchQuery}"` : 'Popular Personalities'}
                        </h2>
                        {#if totalResults}
                            <p class="text-xs text-dark/60">Page {currentPage} of {totalPages} ({totalResults} people found)</p>
                        {/if}
                    </div>

                    <Pagination
                        {currentPage}
                        {totalPages}
                        {totalResults}
                        {goToPreviousPage}
                        {goToNextPage}
                    />
                </div>

                <!-- Unified People Grid -->
                {#if showPeople}
                    <div
                        class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                        in:fly={{ y: 30, duration: 400 }}
                    >
                        {#each people as person (person.id)}
                            <div
                                class="group relative flex flex-col overflow-hidden rounded-2xl bg-dark text-light shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/25"
                            >
                                <!-- Portrait -->
                                <div class="relative aspect-[2/3] w-full overflow-hidden bg-gray-900">
                                    {#if person.profile_path}
                                        <img
                                            src={'https://image.tmdb.org/t/p/w500' + person.profile_path}
                                            alt={person.name}
                                            loading="lazy"
                                            class="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                                        />
                                    {:else}
                                        <div class="flex h-full w-full flex-col items-center justify-center p-3 text-center text-light/40">
                                            <Icon icon="mdi:account" class="mb-2 text-4xl" />
                                            <span class="text-[11px] font-semibold">No Image Available</span>
                                        </div>
                                    {/if}
                                    <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-80"></div>
                                </div>

                                <!-- Card Meta -->
                                <div class="flex flex-1 flex-col justify-between p-3.5">
                                    <div>
                                        <h3
                                            class="line-clamp-1 text-sm font-bold text-light transition-colors group-hover:text-secondary"
                                            title={person.name}
                                        >
                                            {person.name}
                                        </h3>
                                        <p class="mt-1 line-clamp-1 text-xs text-light/65">
                                            {person.known_for_department || 'Entertainment'}
                                        </p>
                                    </div>

                                    <div class="mt-4 pt-3 border-t border-white/10">
                                        <button
                                            type="button"
                                            class="w-full inline-flex items-center justify-center gap-1 rounded-lg bg-secondary py-1.5 px-3 text-xs font-semibold text-light shadow transition-all duration-150 hover:bg-danger active:scale-95"
                                            on:click={() => goToPersonDetails(person)}
                                        >
                                            View Details
                                            <Icon icon="mdi:chevron-right" class="text-sm" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>

                    <!-- Bottom Pagination -->
                    <div class="mt-12 flex justify-center border-t border-secondary/15 pt-8">
                        <Pagination
                            {currentPage}
                            {totalPages}
                            {totalResults}
                            {goToPreviousPage}
                            {goToNextPage}
                        />
                    </div>
                {/if}
            {:else if !loading && !error}
                <div class="my-16 flex flex-col items-center justify-center text-center">
                    <Icon icon="mdi:account-off-outline" class="mb-3 text-6xl text-dark/30" />
                    <h3 class="text-lg font-bold text-dark">No people found</h3>
                    <p class="mt-1 text-sm text-dark/60">We couldn't find anyone matching "{searchQuery}". Try searching by another name.</p>
                </div>
            {/if}
        </main>
    </div>
{/if}

<FooterComponent />