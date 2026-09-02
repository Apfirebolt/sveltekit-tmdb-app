<script lang="ts">
    import { onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    import apiClient from '$lib/plugins/interceptor';
    import HeaderComponent from '$lib/components/Header.svelte';
    import FooterComponent from '$lib/components/Footer.svelte';
    import PersonCardView from '$lib/components/PersonCardView.svelte';
    import Loader from '$lib/components/Loader.svelte';
    import Icon from '@iconify/svelte';
    import type { DetailedMovie } from '$lib/types/Movie.ts';

    export let data;

    $: movie = data.movie as DetailedMovie | null;

    let movieImages: any[] = [];
    let movieVideos: any[] = [];
    let movieRecommendations: any[] = [];
    let movieReviews: any[] = [];
    let movieCast: any[] = [];
    let movieCrew: any[] = [];

    const tabs = [
        { name: 'images', label: 'Images', icon: 'mdi:image-multiple-outline' },
        { name: 'videos', label: 'Videos', icon: 'mdi:play-circle-outline' },
        { name: 'cast', label: 'Cast', icon: 'mdi:account-group-outline' },
        { name: 'crew', label: 'Crew', icon: 'mdi:account-tie-outline' },
        { name: 'reviews', label: 'Reviews', icon: 'mdi:comment-quote-outline' },
        { name: 'recommendations', label: 'Recommendations', icon: 'mdi:movie-open-star-outline' }
    ];

    let selectedTab = 'images';
    const selectTab = (tab: string) => {
        selectedTab = tab;
    };

    const getMovieImages = async (movieId: string | number) => {
        try {
            const response = await apiClient.get(
                `/movie/${movieId}/images?api_key=${import.meta.env.VITE_APP_KEY}`
            );
            if (response.data?.backdrops) {
                movieImages = response.data.backdrops;
            }
        } catch (error) {
            console.error('Error fetching movie images:', error);
        }
    };

    const getMovieVideos = async (movieId: string | number) => {
        try {
            const response = await apiClient.get(
                `/movie/${movieId}/videos?api_key=${import.meta.env.VITE_APP_KEY}`
            );
            if (response.data?.results) {
                movieVideos = response.data.results;
            }
        } catch (error) {
            console.error('Error fetching movie videos:', error);
        }
    };

    const getMovieRecommendations = async (movieId: string | number) => {
        try {
            const response = await apiClient.get(
                `/movie/${movieId}/recommendations?api_key=${import.meta.env.VITE_APP_KEY}`
            );
            if (response.data?.results) {
                movieRecommendations = response.data.results;
            }
        } catch (error) {
            console.error('Error fetching movie recommendations:', error);
        }
    };

    const getMovieReviews = async (movieId: string | number) => {
        try {
            const response = await apiClient.get(
                `/movie/${movieId}/reviews?api_key=${import.meta.env.VITE_APP_KEY}`
            );
            if (response.data?.results) {
                movieReviews = response.data.results;
            }
        } catch (error) {
            console.error('Error fetching movie reviews:', error);
        }
    };

    const getMovieCast = async (movieId: string | number) => {
        try {
            const response = await apiClient.get(
                `/movie/${movieId}/credits?api_key=${import.meta.env.VITE_APP_KEY}`
            );
            if (response.data?.cast) {
                movieCast = response.data.cast;
            }
            if (response.data?.crew) {
                movieCrew = response.data.crew;
            }
        } catch (error) {
            console.error('Error fetching credits:', error);
        }
    };

    const getMovieCrew = async (movieId: string | number) => {
        // Handled simultaneously via credits endpoint in getMovieCast
    };

    onMount(() => {
        if (movie?.id) {
            Promise.all([
                getMovieImages(movie.id),
                getMovieVideos(movie.id),
                getMovieRecommendations(movie.id),
                getMovieReviews(movie.id),
                getMovieCast(movie.id)
            ]);
        }
    });
</script>

<svelte:head>
    <title>{movie ? movie.title : 'Loading...'} - TMDB</title>
    <meta name="description" content={movie?.overview || 'Movie Details'} />
</svelte:head>

<HeaderComponent title={movie ? movie.title : 'Movie Details'} />

{#if !movie}
    <div class="flex min-h-[70vh] items-center justify-center">
        <Loader />
    </div>
{:else}
    <!-- Immersive Hero with Poster Backdrop & Vignette Overlay -->
    <div class="relative w-full overflow-hidden bg-dark text-light">
        <div
            class="absolute inset-0 bg-cover bg-center filter blur-md opacity-35 scale-105"
            style="background-image: url('https://image.tmdb.org/t/p/w1280{movie.backdrop_path || movie.poster_path}');"
        ></div>
        <div class="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-dark via-dark/60 to-transparent"></div>

        <div class="container relative z-10 mx-auto px-4 py-12 md:py-20 lg:px-8">
            <div class="flex flex-col md:flex-row gap-8 lg:gap-12 items-start" in:fly={{ y: 30, duration: 600 }}>
                <!-- Floating Poster Card -->
                <div class="w-48 sm:w-64 md:w-80 shrink-0 mx-auto md:mx-0 shadow-2xl rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                    {#if movie.poster_path}
                        <img
                            src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                            alt={movie.title}
                            class="w-full h-auto object-cover"
                        />
                    {:else}
                        <div class="aspect-[2/3] flex flex-col items-center justify-center p-6 text-light/40 text-center">
                            <Icon icon="mdi:filmstrip-off" class="text-5xl mb-2" />
                            <span class="text-sm">Poster unavailable</span>
                        </div>
                    {/if}
                </div>

                <!-- Core Details & Quick Badges -->
                <div class="flex-1 text-left">
                    <div class="flex flex-wrap items-center gap-2 mb-3">
                        {#if movie.release_date}
                            <span class="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/10 backdrop-blur-md border border-white/15">
                                {movie.release_date.split('-')[0]}
                            </span>
                        {/if}
                        {#if movie.runtime}
                            <span class="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/10 backdrop-blur-md border border-white/15">
                                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                            </span>
                        {/if}
                        <div class="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md bg-primary text-light shadow-sm">
                            <Icon icon="mdi:star" class="text-sm text-yellow-300" />
                            <span>{movie.vote_average?.toFixed(1) || 'N/A'} / 10</span>
                        </div>
                    </div>

                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
                        {movie.title}
                    </h1>

                    {#if movie.genres?.length}
                        <div class="flex flex-wrap gap-2 mb-6">
                            {#each movie.genres as genre}
                                <span class="rounded-full bg-secondary/30 px-3 py-0.5 text-xs font-medium text-light/90 border border-secondary/40">
                                    {genre.name}
                                </span>
                            {/each}
                        </div>
                    {/if}

                    <div class="mb-6">
                        <h2 class="text-xs uppercase tracking-wider text-light/60 font-semibold mb-2">Overview</h2>
                        <p class="text-sm sm:text-base leading-relaxed text-light/85 max-w-3xl">
                            {movie.overview || 'No synopsis has been provided for this title.'}
                        </p>
                    </div>

                    <!-- Compact Metadata Grid -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs">
                        <div>
                            <span class="text-light/50 block mb-1">Status</span>
                            <span class="font-medium">{movie.status || 'Released'}</span>
                        </div>
                        <div>
                            <span class="text-light/50 block mb-1">Languages</span>
                            <span class="font-medium truncate block" title={movie.spoken_languages?.map(l => l.name).join(', ')}>
                                {movie.spoken_languages?.map(l => l.name).join(', ') || 'N/A'}
                            </span>
                        </div>
                        <div class="col-span-2 sm:col-span-1">
                            <span class="text-light/50 block mb-1">Production</span>
                            <span class="font-medium truncate block" title={movie.production_companies?.map(c => c.name).join(', ')}>
                                {movie.production_companies?.map(c => c.name).join(', ') || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Secondary Media Tabs Bar -->
    <div class="sticky top-20 z-30 border-b border-secondary/15 bg-light/95 backdrop-blur-md">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav class="flex space-x-2 sm:space-x-4 overflow-x-auto py-3 no-scrollbar" aria-label="Media tabs">
                {#each tabs as tab}
                    <button
                        type="button"
                        class={[
                            'flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150',
                            selectedTab === tab.name
                                ? 'bg-primary text-light shadow-md shadow-primary/20'
                                : 'text-dark/70 hover:text-dark hover:bg-secondary/10'
                        ].join(' ')}
                        on:click={() => selectTab(tab.name)}
                    >
                        <Icon icon={tab.icon} class="text-base" />
                        <span>{tab.label}</span>
                    </button>
                {/each}
            </nav>
        </div>
    </div>

    <!-- Dynamic Tab Content Sections -->
    <main class="container mx-auto min-h-[400px] px-4 py-10 sm:px-6 lg:px-8">
        <!-- Images -->
        {#if selectedTab === 'images'}
            {#if movieImages.length > 0}
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" in:fade={{ duration: 250 }}>
                    {#each movieImages as image}
                        <div class="group relative aspect-video overflow-hidden rounded-2xl bg-dark shadow-md border border-secondary/10">
                            <img
                                src={`https://image.tmdb.org/t/p/w780${image.file_path}`}
                                alt="Backdrop from {movie.title}"
                                loading="lazy"
                                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="py-16 text-center text-dark/60">
                    <Icon icon="mdi:image-off-outline" class="mx-auto text-5xl mb-2 opacity-40" />
                    <p class="font-medium">No backdrops or images found for this title.</p>
                </div>
            {/if}
        {/if}

        <!-- Videos -->
        {#if selectedTab === 'videos'}
            {#if movieVideos.length > 0}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6" in:fade={{ duration: 250 }}>
                    {#each movieVideos as video}
                        <div class="overflow-hidden rounded-2xl bg-dark shadow-md border border-secondary/10">
                            <div class="aspect-video w-full">
                                <iframe
                                    class="h-full w-full"
                                    src={`https://www.youtube-nocookie.com/embed/${video.key}`}
                                    title={video.name}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen
                                ></iframe>
                            </div>
                            <div class="p-3 bg-white border-t border-gray-100">
                                <h3 class="text-xs font-bold text-dark truncate" title={video.name}>{video.name}</h3>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="py-16 text-center text-dark/60">
                    <Icon icon="mdi:video-off-outline" class="mx-auto text-5xl mb-2 opacity-40" />
                    <p class="font-medium">No promotional trailers or clips available.</p>
                </div>
            {/if}
        {/if}

        <!-- Cast -->
        {#if selectedTab === 'cast'}
            {#if movieCast.length > 0}
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" in:fade={{ duration: 250 }}>
                    {#each movieCast as cast}
                        <PersonCardView {cast} />
                    {/each}
                </div>
            {:else}
                <div class="py-16 text-center text-dark/60">
                    <Icon icon="mdi:account-off-outline" class="mx-auto text-5xl mb-2 opacity-40" />
                    <p class="font-medium">No cast members cataloged for this title.</p>
                </div>
            {/if}
        {/if}

        <!-- Crew -->
        {#if selectedTab === 'crew'}
            {#if movieCrew.length > 0}
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" in:fade={{ duration: 250 }}>
                    {#each movieCrew as crew}
                        <div class="flex flex-col overflow-hidden rounded-2xl border border-secondary/15 bg-light p-3 text-center shadow-sm">
                            <div class="relative aspect-square w-full mb-3 overflow-hidden rounded-xl bg-gray-200">
                                {#if crew.profile_path}
                                    <img
                                        src={`https://image.tmdb.org/t/p/w300${crew.profile_path}`}
                                        alt={crew.name}
                                        loading="lazy"
                                        class="h-full w-full object-cover"
                                    />
                                {:else}
                                    <div class="flex h-full w-full items-center justify-center text-dark/30">
                                        <Icon icon="mdi:account" class="text-4xl" />
                                    </div>
                                {/if}
                            </div>
                            <h3 class="text-xs font-bold text-dark truncate" title={crew.name}>{crew.name}</h3>
                            <p class="text-[11px] text-dark/60 truncate" title={crew.job}>{crew.job}</p>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="py-16 text-center text-dark/60">
                    <Icon icon="mdi:account-hard-hat-outline" class="mx-auto text-5xl mb-2 opacity-40" />
                    <p class="font-medium">No crew members cataloged for this movie.</p>
                </div>
            {/if}
        {/if}

        <!-- Reviews -->
        {#if selectedTab === 'reviews'}
            {#if movieReviews.length > 0}
                <div class="space-y-4 max-w-4xl mx-auto" in:fade={{ duration: 250 }}>
                    {#each movieReviews as review}
                        <div class="rounded-2xl border border-secondary/15 bg-light p-6 shadow-sm">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-light font-bold text-sm">
                                    {review.author?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h3 class="text-sm font-bold text-dark">{review.author}</h3>
                                    <span class="text-[11px] text-dark/50">Verified TMDB Reviewer</span>
                                </div>
                            </div>
                            <p class="text-xs sm:text-sm leading-relaxed text-dark/80 whitespace-pre-line line-clamp-6">
                                {review.content}
                            </p>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="py-16 text-center text-dark/60">
                    <Icon icon="mdi:comment-remove-outline" class="mx-auto text-5xl mb-2 opacity-40" />
                    <p class="font-medium">No user reviews written for this movie yet.</p>
                </div>
            {/if}
        {/if}

        <!-- Recommendations -->
        {#if selectedTab === 'recommendations'}
            {#if movieRecommendations.length > 0}
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6" in:fade={{ duration: 250 }}>
                    {#each movieRecommendations as rec}
                        <a
                            href={`/movies/${rec.id}`}
                            class="group flex flex-col overflow-hidden rounded-2xl border border-secondary/15 bg-light shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div class="relative aspect-[2/3] w-full overflow-hidden bg-gray-900">
                                {#if rec.poster_path}
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`}
                                        alt={rec.title}
                                        loading="lazy"
                                        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                {:else}
                                    <div class="flex h-full w-full items-center justify-center text-light/40">
                                        <Icon icon="mdi:filmstrip-off" class="text-3xl" />
                                    </div>
                                {/if}
                            </div>
                            <div class="p-3">
                                <h3 class="text-xs font-bold text-dark truncate group-hover:text-primary transition-colors" title={rec.title}>
                                    {rec.title}
                                </h3>
                                {#if rec.vote_average}
                                    <div class="mt-1 flex items-center gap-1 text-[11px] text-dark/60">
                                        <Icon icon="mdi:star" class="text-yellow-500 text-xs" />
                                        <span>{rec.vote_average.toFixed(1)}</span>
                                    </div>
                                {/if}
                            </div>
                        </a>
                    {/each}
                </div>
            {:else}
                <div class="py-16 text-center text-dark/60">
                    <Icon icon="mdi:movie-off-outline" class="mx-auto text-5xl mb-2 opacity-40" />
                    <p class="font-medium">No recommendations available for this movie.</p>
                </div>
            {/if}
        {/if}
    </main>
{/if}

<FooterComponent />