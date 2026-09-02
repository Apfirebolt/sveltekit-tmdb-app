<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { fly } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import HeaderComponent from '$lib/components/Header.svelte';
    import FooterComponent from '$lib/components/Footer.svelte';
    import { trendingStore } from '$lib/stores/trending';
    import Icon from '@iconify/svelte';
    import type { Movie } from '$lib/types/Movie';

    $: ({ loading, movies } = $trendingStore);

    const text = 'Welcome to TMDB Movies App';
    let displayedText = '';
    let index = 0;
    const currentPage = 1;
    let timer: ReturnType<typeof setTimeout> | null = null;

    // Typewriter effect logic
    const typeWriter = () => {
        if (index < text.length) {
            displayedText += text[index];
            index++;
            timer = setTimeout(typeWriter, 85);
        }
    };

    typeWriter();

    const goToMovieDetails = (movie: Movie) => {
        goto(`/movies/${movie.id}`);
    };

    onMount(() => {
        trendingStore.getTrendingMovies('day', currentPage);
    });

    onDestroy(() => {
        if (timer) clearTimeout(timer);
    });
</script>

<HeaderComponent />

<!-- Hero Section -->
<section
    class="relative flex min-h-[520px] w-full items-center justify-center bg-cover bg-center"
    style="background-image: url('https://atthemovies.uk/cdn/shop/products/GoodWillHunting1997us27x40in175.jpg?v=1621383309');"
>
    <div class="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/85"></div>

    <div class="relative z-10 mx-auto max-w-4xl px-4 py-16 text-center text-white">
        <h1
            class="mb-4 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            in:fly={{ y: 30, duration: 600 }}
        >
            {displayedText}
            {#if index < text.length}
                <span class="animate-pulse">|</span>
            {/if}
        </h1>

        <p
            class="mx-auto mb-6 max-w-2xl text-base text-gray-200 sm:text-lg"
            in:fly={{ y: 30, duration: 600, delay: 150 }}
        >
            Discover your favorite movies, explore trending shows, and dive into the entertainment industry powered by the TMDB API.
        </p>

        <div
            class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-light backdrop-blur-md transition-colors hover:bg-white/20"
            in:fly={{ y: 20, duration: 500, delay: 300 }}
        >
            <Icon icon="mdi:information-outline" class="text-base text-light/80" />
            <span>Find the API key in the</span>
            <a
                href="https://www.themoviedb.org/documentation/api"
                target="_blank"
                rel="noreferrer"
                class="font-semibold text-light underline underline-offset-4 transition-colors hover:text-danger"
            >
                TMDB Documentation
            </a>
        </div>
    </div>
</section>

<!-- Feature Highlights -->
<section class="bg-gray-100 py-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-12 text-center" in:fly={{ y: 30, duration: 500 }}>
            <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Explore Our Features
            </h2>
            <p class="mt-2 text-sm text-gray-600">Everything you need to discover and track cinema.</p>
        </div>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div
                class="group rounded-2xl border border-gray-200/80 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                in:fly={{ y: 30, duration: 500 }}
            >
                <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-light">
                    <Icon icon="mdi:movie-search-outline" class="text-2xl" />
                </div>
                <h3 class="mb-2 text-lg font-bold text-gray-900">Browse Movies</h3>
                <p class="text-sm leading-relaxed text-gray-600">Find movies effortlessly by genre, user rating, or release date.</p>
            </div>

            <div
                class="group rounded-2xl border border-gray-200/80 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                in:fly={{ y: 30, duration: 500, delay: 150 }}
            >
                <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-light">
                    <Icon icon="mdi:bookmark-multiple-outline" class="text-2xl" />
                </div>
                <h3 class="mb-2 text-lg font-bold text-gray-900">Create Watchlists</h3>
                <p class="text-sm leading-relaxed text-gray-600">Bookmark must-watch films and keep your backlog organized.</p>
            </div>

            <div
                class="group rounded-2xl border border-gray-200/80 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                in:fly={{ y: 30, duration: 500, delay: 300 }}
            >
                <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-light">
                    <Icon icon="mdi:thumb-up-outline" class="text-2xl" />
                </div>
                <h3 class="mb-2 text-lg font-bold text-gray-900">Get Recommendations</h3>
                <p class="text-sm leading-relaxed text-gray-600">Receive smart suggestions tailored to your cinematic taste.</p>
            </div>
        </div>
    </div>
</section>

<!-- Trending Movies Section -->
<section class="py-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-10 flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
                <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Trending Movies</h2>
                <p class="mt-1 text-xs text-gray-500">Top-streamed and most discussed films today</p>
            </div>
            <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Daily Highlights
            </span>
        </div>

        {#if loading}
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {#each Array(4) as _}
                    <div class="animate-pulse rounded-2xl bg-gray-100 p-4 shadow-sm">
                        <div class="aspect-[2/3] w-full rounded-xl bg-gray-300"></div>
                        <div class="mt-4 h-5 w-3/4 rounded bg-gray-300"></div>
                        <div class="mt-2 h-3 w-1/3 rounded bg-gray-300"></div>
                        <div class="mt-3 h-12 w-full rounded bg-gray-200"></div>
                    </div>
                {/each}
            </div>
        {:else if movies && movies.length > 0}
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                {#each movies as movie (movie.id)}
                    <div
                        class="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                        in:fly={{ y: 25, duration: 400 }}
                    >
                        <!-- Poster -->
                        <div class="relative aspect-[2/3] w-full overflow-hidden bg-gray-900">
                            {#if movie.poster_path}
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    loading="lazy"
                                    class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                />
                            {:else}
                                <div class="flex h-full w-full flex-col items-center justify-center p-4 text-center text-gray-400">
                                    <Icon icon="mdi:filmstrip-off" class="mb-2 text-4xl" />
                                    <span class="text-xs font-semibold">No Image Available</span>
                                </div>
                            {/if}
                        </div>

                        <!-- Card Details -->
                        <div class="flex flex-1 flex-col justify-between p-5">
                            <div>
                                <h3
                                    class="line-clamp-1 text-base font-bold text-gray-900 transition-colors group-hover:text-primary"
                                    title={movie.title}
                                >
                                    {movie.title}
                                </h3>
                                
                                {#if movie.release_date}
                                    <div class="mt-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                        <Icon icon="mdi:calendar-blank-outline" class="text-sm" />
                                        <span>{movie.release_date.split('-')[0]}</span>
                                    </div>
                                {/if}

                                <p class="mt-3 line-clamp-3 text-xs leading-relaxed text-gray-600">
                                    {movie.overview || 'No overview provided for this movie.'}
                                </p>
                            </div>

                            <div class="mt-5 border-t border-gray-100 pt-4">
                                <button
                                    type="button"
                                    class="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-light shadow-sm transition-all duration-150 hover:bg-danger active:scale-95"
                                    on:click={() => goToMovieDetails(movie)}
                                >
                                    <span>View Details</span>
                                    <Icon icon="mdi:arrow-right" class="text-sm" />
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</section>

<FooterComponent />