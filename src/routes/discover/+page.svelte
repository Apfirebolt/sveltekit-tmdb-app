<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { fly, fade } from 'svelte/transition';
    import { discoverStore } from '$lib/stores/discover';
    import HeaderComponent from '$lib/components/Header.svelte';
    import FooterComponent from '$lib/components/Footer.svelte';
    import Pagination from '$lib/components/Pagination.svelte';
    import Loader from '$lib/components/Loader.svelte';
    import Icon from '@iconify/svelte';

    import type { DiscoverResponse, MovieResult } from '$lib/types/Discover.ts';

    $: ({ items, loading, totalPages, totalResults, error } = $discoverStore);

    let mediaType: 'movie' | 'tv' = 'movie';
    let currentPage: number = 1;
    let showItems: boolean = false;
    let typewriterTimer: ReturnType<typeof setTimeout> | null = null;

    const text = 'Discover Cinema & Television';
    let displayedText = '';
    let index = 0;

    $: if (!loading && !error && items.length > 0) {
        showItems = true;
    } else {
        showItems = false;
    }

    const typeWriter = () => {
        if (index < text.length) {
            displayedText += text[index];
            index++;
            typewriterTimer = setTimeout(typeWriter, 85);
        }
    };

    typeWriter();

    const goToNextPage = () => {
        currentPage += 1;
        discoverStore.fetchDiscoverItems(mediaType, currentPage);
    };

    const goToPreviousPage = () => {
        currentPage -= 1;
        if (currentPage < 1) {
            currentPage = 1;
        }
        discoverStore.fetchDiscoverItems(mediaType, currentPage);
    };

    const switchMediaType = (type: 'movie' | 'tv') => {
        if (mediaType === type) return;
        mediaType = type;
        currentPage = 1;
        discoverStore.fetchDiscoverItems(mediaType, currentPage);
    };

    const goToDetails = (item: any) => {
        const route = mediaType === 'tv' ? `/shows/${item.id}` : `/movies/${item.id}`;
        goto(route);
    };

    onMount(() => {
        discoverStore.fetchDiscoverItems(mediaType, currentPage);
    });

    onDestroy(() => {
        if (typewriterTimer) clearTimeout(typewriterTimer);
    });
</script>

<svelte:head>
    <title>Discover - Browse Movies & TV Shows</title>
    <meta
        name="description"
        content="Discover and explore top-rated movies and television series across the industry."
    />
</svelte:head>

<HeaderComponent title="Discover" />

{#if loading}
    <div class="flex min-h-[60vh] items-center justify-center">
        <Loader />
    </div>
{:else if error}
    <div class="container mx-auto px-4 py-16 text-center">
        <div class="mx-auto max-w-md rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <Icon icon="mdi:alert-circle-outline" class="mx-auto mb-3 text-4xl text-red-500" />
            <h2 class="text-lg font-semibold text-red-600">Failed to Load Discoveries</h2>
            <p class="mt-1 text-sm text-red-500/90">{error.message}</p>
        </div>
    </div>
{:else}
    <div class="min-h-screen bg-accent text-dark">
        <!-- Hero Section -->
        <section
            class="relative flex min-h-[460px] w-full items-center justify-center overflow-visible bg-cover bg-center py-16"
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
                    Explore trending releases, hidden gems, and critically acclaimed productions.
                </p>

                <!-- Media Selector Pill Switcher -->
                <div class="inline-flex rounded-2xl border border-white/20 bg-light/95 p-1.5 shadow-2xl backdrop-blur-md">
                    <button
                        type="button"
                        class={[
                            'inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-200',
                            mediaType === 'movie'
                                ? 'bg-secondary text-light shadow-md'
                                : 'text-dark/70 hover:text-dark hover:bg-secondary/10'
                        ].join(' ')}
                        on:click={() => switchMediaType('movie')}
                    >
                        <Icon icon="mdi:movie-open-outline" class="text-lg" />
                        <span>Movies</span>
                    </button>

                    <button
                        type="button"
                        class={[
                            'inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-200',
                            mediaType === 'tv'
                                ? 'bg-secondary text-light shadow-md'
                                : 'text-dark/70 hover:text-dark hover:bg-secondary/10'
                        ].join(' ')}
                        on:click={() => switchMediaType('tv')}
                    >
                        <Icon icon="mdi:television-classic" class="text-lg" />
                        <span>TV Shows</span>
                    </button>
                </div>
            </div>
        </section>

        <!-- Main Discovery Feed -->
        <main class="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
            {#if items.length > 0}
                <!-- Navigation & Filter Status -->
                <div class="mb-8 flex flex-col items-center justify-between gap-4 border-b border-secondary/15 pb-6 sm:flex-row">
                    <div>
                        <div class="flex items-center gap-2">
                            <h2 class="text-xl font-bold tracking-tight text-dark sm:text-2xl">
                                {mediaType === 'movie' ? 'Discovered Movies' : 'Discovered TV Series'}
                            </h2>
                            <span class="rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-semibold uppercase text-secondary">
                                {mediaType}
                            </span>
                        </div>
                        {#if totalResults}
                            <p class="mt-1 text-xs text-dark/60">
                                Page {currentPage} of {totalPages} ({Number(totalResults).toLocaleString()} entries found)
                            </p>
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

                <!-- Structured Grid Cards -->
                {#if showItems}
                    <div
                        class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                        in:fly={{ y: 30, duration: 400 }}
                    >
                        {#each items as item (item.id)}
                            {@const itemTitle = item.title || item.name || item.original_title || item.original_name || 'Untitled'}
                            {@const itemDate = item.release_date || item.first_air_date}

                            <div
                                class="group relative flex flex-col overflow-hidden rounded-2xl bg-dark text-light shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/25"
                            >
                                <!-- Poster / Backdrop Image Frame -->
                                <div class="relative aspect-[2/3] w-full overflow-hidden bg-gray-900">
                                    {#if item.poster_path}
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                            alt={itemTitle}
                                            loading="lazy"
                                            class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                        />
                                    {:else if item.backdrop_path}
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                                            alt={itemTitle}
                                            loading="lazy"
                                            class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                        />
                                    {:else}
                                        <div class="flex h-full w-full flex-col items-center justify-center p-4 text-center text-light/40">
                                            <Icon icon="mdi:filmstrip-off" class="mb-2 text-4xl" />
                                            <span class="text-xs font-semibold">No Image Available</span>
                                        </div>
                                    {/if}

                                    <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-80"></div>

                                    {#if item.vote_average}
                                        <div class="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-dark/80 backdrop-blur-md px-2 py-1 text-xs font-bold text-light shadow">
                                            <Icon icon="mdi:star" class="text-yellow-400 text-xs" />
                                            <span>{item.vote_average.toFixed(1)}</span>
                                        </div>
                                    {/if}
                                </div>

                                <!-- Card Metadata -->
                                <div class="flex flex-1 flex-col justify-between p-4">
                                    <div>
                                        <h3
                                            class="line-clamp-1 text-base font-bold text-light transition-colors group-hover:text-secondary"
                                            title={itemTitle}
                                        >
                                            {itemTitle}
                                        </h3>

                                        {#if itemDate}
                                            <div class="mt-1 flex items-center gap-1 text-xs text-light/50">
                                                <Icon icon="mdi:calendar-blank-outline" class="text-sm" />
                                                <span>{itemDate.split('-')[0]}</span>
                                            </div>
                                        {/if}

                                        <p class="mt-2.5 line-clamp-3 text-xs leading-relaxed text-light/70">
                                            {item.overview || 'No synopsis provided for this production.'}
                                        </p>
                                    </div>

                                    <div class="mt-4 border-t border-white/10 pt-3">
                                        <button
                                            type="button"
                                            class="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-secondary py-2 px-3 text-xs font-semibold text-light shadow transition-all duration-150 hover:bg-danger active:scale-95"
                                            on:click={() => goToDetails(item)}
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
                    <Icon icon="mdi:movie-open-remove-outline" class="mb-3 text-6xl text-dark/30" />
                    <h3 class="text-lg font-bold text-dark">No titles discovered</h3>
                    <p class="mt-1 text-sm text-dark/60">
                        Try switching between Movies and TV Shows above to refresh the discovery stream.
                    </p>
                </div>
            {/if}
        </main>
    </div>
{/if}

<FooterComponent />