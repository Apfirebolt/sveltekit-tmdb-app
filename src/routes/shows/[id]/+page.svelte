<script lang="ts">
    import { onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    import apiClient from '$lib/plugins/interceptor';
    import { goto } from '$app/navigation';
    import HeaderComponent from '$lib/components/Header.svelte';
    import FooterComponent from '$lib/components/Footer.svelte';
    import Loader from '$lib/components/Loader.svelte';
    import Icon from '@iconify/svelte';
    import type { DetailedTVShow } from '$lib/types/Show.ts';

    export let data;

    $: tvShow = data.show as DetailedTVShow | null;

    let showImages: any[] = [];
    let showVideos: any[] = [];
    let showEpisodes: any[] = [];
    let showSeasons: any[] = [];
    let showCast: any[] = [];
    let showCrew: any[] = [];
    let showRecommendations: any[] = [];
    let selectedTab = 'images';

    const tabs = [
        { name: 'images', label: 'Images', icon: 'mdi:image-multiple-outline' },
        { name: 'videos', label: 'Videos', icon: 'mdi:play-circle-outline' },
        { name: 'episodes', label: 'Episodes', icon: 'mdi:filmstrip' },
        { name: 'seasons', label: 'Seasons', icon: 'mdi:folder-multiple-outline' },
        { name: 'cast', label: 'Cast', icon: 'mdi:account-group-outline' },
        { name: 'crew', label: 'Crew', icon: 'mdi:account-tie-outline' },
        { name: 'recommendations', label: 'Recommendations', icon: 'mdi:movie-open-star-outline' }
    ];

    const selectTab = (tab: string) => {
        selectedTab = tab;
    };

    const getShowImages = async (showId: number) => {
        try {
            const response = await apiClient.get(
                `/tv/${showId}/images?api_key=${import.meta.env.VITE_APP_KEY}`
            );
            if (response.data?.backdrops) {
                showImages = response.data.backdrops;
            }
        } catch (error) {
            console.error('Error fetching show images:', error);
        }
    };

    const getShowVideos = async (showId: number) => {
        try {
            const response = await apiClient.get(
                `/tv/${showId}/videos?api_key=${import.meta.env.VITE_APP_KEY}`
            );
            if (response.data?.results) {
                showVideos = response.data.results;
            }
        } catch (error) {
            console.error('Error fetching show videos:', error);
        }
    };

    // Fetches Season 1 episodes and pulls available season info
    const getShowEpisodesAndSeasons = async (showId: number) => {
        try {
            const response = await apiClient.get(
                `/tv/${showId}/season/1?api_key=${import.meta.env.VITE_APP_KEY}`
            );
            if (response.data?.episodes) {
                showEpisodes = response.data.episodes;
            }
            // If seasons array exists on season response, use it; otherwise fallback to tvShow.seasons
            if (response.data?.seasons) {
                showSeasons = response.data.seasons;
            } else if (tvShow && (tvShow as any).seasons) {
                showSeasons = (tvShow as any).seasons;
            }
        } catch (error) {
            console.error('Error fetching show season/episodes:', error);
            if (tvShow && (tvShow as any).seasons) {
                showSeasons = (tvShow as any).seasons;
            }
        }
    };

    const getShowRecommendations = async (showId: number) => {
        try {
            const response = await apiClient.get(
                `/tv/${showId}/recommendations?api_key=${import.meta.env.VITE_APP_KEY}`
            );
            if (response.data?.results) {
                showRecommendations = response.data.results;
            }
        } catch (error) {
            console.error('Error fetching show recommendations:', error);
        }
    };

    const getShowCredits = async (showId: number) => {
        try {
            const response = await apiClient.get(
                `/tv/${showId}/credits?api_key=${import.meta.env.VITE_APP_KEY}`
            );
            if (response.data?.cast) {
                showCast = response.data.cast;
            }
            if (response.data?.crew) {
                showCrew = response.data.crew;
            }
        } catch (error) {
            console.error('Error fetching show credits:', error);
        }
    };

    onMount(() => {
        if (tvShow?.id) {
            Promise.all([
                getShowImages(tvShow.id),
                getShowVideos(tvShow.id),
                getShowEpisodesAndSeasons(tvShow.id),
                getShowRecommendations(tvShow.id),
                getShowCredits(tvShow.id)
            ]);
        }
    });
</script>

<svelte:head>
    <title>{tvShow ? tvShow.name : 'Loading...'} - TV Series Details</title>
    <meta name="description" content={tvShow?.overview || 'TV Series Details'} />
</svelte:head>

<HeaderComponent title={tvShow ? tvShow.name : 'TV Show Details'} />

{#if !tvShow}
    <div class="flex min-h-[70vh] items-center justify-center">
        <Loader />
    </div>
{:else}
    <!-- Immersive Backdrop Hero -->
    <div class="relative w-full overflow-hidden bg-dark text-light">
        <div
            class="absolute inset-0 bg-cover bg-center filter blur-md opacity-30 scale-105"
            style="background-image: url('https://image.tmdb.org/t/p/w1280{tvShow.backdrop_path || tvShow.poster_path}');"
        ></div>
        <div class="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-dark via-dark/60 to-transparent"></div>

        <div class="container relative z-10 mx-auto px-4 py-12 md:py-16 lg:px-8">
            <div class="flex flex-col md:flex-row gap-8 lg:gap-12 items-start" in:fly={{ y: 30, duration: 600 }}>
                <!-- Floating Poster -->
                <div class="w-48 sm:w-64 md:w-80 shrink-0 mx-auto md:mx-0 shadow-2xl rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                    {#if tvShow.poster_path}
                        <img
                            src={`https://image.tmdb.org/t/p/w780${tvShow.poster_path}`}
                            alt={tvShow.name}
                            class="w-full h-auto aspect-[2/3] object-cover"
                        />
                    {:else}
                        <div class="aspect-[2/3] flex flex-col items-center justify-center p-6 text-light/40 text-center">
                            <Icon icon="mdi:television-off" class="text-5xl mb-2" />
                            <span class="text-sm">Poster unavailable</span>
                        </div>
                    {/if}
                </div>

                <!-- Show Header Details -->
                <div class="flex-1 text-left">
                    <div class="flex flex-wrap items-center gap-2 mb-3">
                        {#if tvShow.first_air_date}
                            <span class="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/10 backdrop-blur-md border border-white/15">
                                {tvShow.first_air_date.split('-')[0]}
                            </span>
                        {/if}
                        {#if tvShow.number_of_seasons}
                            <span class="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/10 backdrop-blur-md border border-white/15">
                                {tvShow.number_of_seasons} {tvShow.number_of_seasons === 1 ? 'Season' : 'Seasons'}
                            </span>
                        {/if}
                        <div class="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md bg-primary text-light shadow-sm">
                            <Icon icon="mdi:star" class="text-sm text-yellow-300" />
                            <span>{tvShow.vote_average ? tvShow.vote_average.toFixed(1) : 'N/A'} / 10</span>
                        </div>
                    </div>

                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
                        {tvShow.name}
                    </h1>

                    {#if tvShow.genres?.length}
                        <div class="flex flex-wrap gap-2 mb-6">
                            {#each tvShow.genres as genre}
                                <span class="rounded-full bg-secondary/30 px-3 py-0.5 text-xs font-medium text-light/90 border border-secondary/40">
                                    {genre.name}
                                </span>
                            {/each}
                        </div>
                    {/if}

                    <div class="mb-6">
                        <h2 class="text-xs uppercase tracking-wider text-light/60 font-semibold mb-2">Overview</h2>
                        <p class="text-sm sm:text-base leading-relaxed text-light/85 max-w-3xl">
                            {tvShow.overview || 'No synopsis has been provided for this television series.'}
                        </p>
                    </div>

                    <!-- Meta Grid -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs">
                        <div>
                            <span class="text-light/50 block mb-1">First Aired</span>
                            <span class="font-medium">{tvShow.first_air_date || 'N/A'}</span>
                        </div>
                        <div>
                            <span class="text-light/50 block mb-1">Languages</span>
                            <span class="font-medium truncate block" title={tvShow.spoken_languages?.map(l => l.name).join(', ')}>
                                {tvShow.spoken_languages?.map(l => l.name).join(', ') || 'N/A'}
                            </span>
                        </div>
                        <div class="col-span-2 sm:col-span-1">
                            <span class="text-light/50 block mb-1">Production</span>
                            <span class="font-medium truncate block" title={tvShow.production_companies?.map(c => c.name).join(', ')}>
                                {tvShow.production_companies?.map(c => c.name).join(', ') || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Sticky Navigation Tab Bar -->
    <div class="sticky top-20 z-30 border-b border-secondary/15 bg-light/95 backdrop-blur-md">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav class="flex space-x-2 sm:space-x-4 overflow-x-auto py-3 no-scrollbar" aria-label="TV Media Tabs">
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

    <!-- Main Content Panels -->
    <main class="container mx-auto min-h-[420px] px-4 py-10 sm:px-6 lg:px-8">
        <!-- Images -->
        {#if selectedTab === 'images'}
            {#if showImages.length > 0}
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" in:fade={{ duration: 250 }}>
                    {#each showImages as image}
                        <div class="group relative aspect-video overflow-hidden rounded-2xl bg-dark shadow-md border border-secondary/10">
                            <img
                                src={`https://image.tmdb.org/t/p/w780${image.file_path}`}
                                alt="Backdrop from {tvShow.name}"
                                loading="lazy"
                                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="py-16 text-center text-dark/60">
                    <Icon icon="mdi:image-off-outline" class="mx-auto text-5xl mb-2 opacity-40" />
                    <p class="font-medium">No backdrops or stills available for this series.</p>
                </div>
            {/if}
        {/if}

        <!-- Videos -->
        {#if selectedTab === 'videos'}
            {#if showVideos.length > 0}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6" in:fade={{ duration: 250 }}>
                    {#each showVideos as video}
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
                            <div class="p-3 bg-light border-t border-secondary/10">
                                <h3 class="text-xs font-bold text-dark truncate" title={video.name}>{video.name}</h3>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="py-16 text-center text-dark/60">
                    <Icon icon="mdi:video-off-outline" class="mx-auto text-5xl mb-2 opacity-40" />
                    <p class="font-medium">No trailers or promo clips found for this show.</p>
                </div>
            {/if}
        {/if}

        <!-- Episodes (Season 1) -->
        {#if selectedTab === 'episodes'}
            {#if showEpisodes.length > 0}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6" in:fade={{ duration: 250 }}>
                    {#each showEpisodes as episode}
                        <div class="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-secondary/15 bg-light shadow-sm transition-all duration-300 hover:shadow-lg">
                            <div class="relative sm:w-48 aspect-video sm:aspect-auto shrink-0 bg-gray-900 overflow-hidden">
                                {#if episode.still_path}
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                                        alt={episode.name}
                                        loading="lazy"
                                        class="h-full w-full object-cover"
                                    />
                                {:else}
                                    <div class="flex h-full w-full items-center justify-center text-dark/30">
                                        <Icon icon="mdi:filmstrip" class="text-3xl" />
                                    </div>
                                {/if}
                                {#if episode.episode_number}
                                    <div class="absolute top-2 left-2 rounded bg-dark/80 px-2 py-0.5 text-[10px] font-bold text-light backdrop-blur-sm">
                                        EP {episode.episode_number}
                                    </div>
                                {/if}
                            </div>
                            <div class="p-4 flex flex-1 flex-col justify-between">
                                <div>
                                    <h3 class="text-sm font-bold text-dark line-clamp-1" title={episode.name}>
                                        {episode.name}
                                    </h3>
                                    {#if episode.air_date}
                                        <p class="text-[11px] text-dark/50 mt-0.5">Air date: {episode.air_date}</p>
                                    {/if}
                                    <p class="mt-2 text-xs text-dark/70 line-clamp-3 leading-relaxed">
                                        {episode.overview || 'No episode summary available.'}
                                    </p>
                                </div>
                                {#if episode.vote_average}
                                    <div class="mt-3 pt-2 border-t border-secondary/10 flex items-center gap-1 text-xs text-dark/60">
                                        <Icon icon="mdi:star" class="text-yellow-500 text-xs" />
                                        <span>{episode.vote_average.toFixed(1)}</span>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="py-16 text-center text-dark/60">
                    <Icon icon="mdi:television-stop" class="mx-auto text-5xl mb-2 opacity-40" />
                    <p class="font-medium">No episode listing available for this series.</p>
                </div>
            {/if}
        {/if}

        <!-- Seasons -->
        {#if selectedTab === 'seasons'}
            {#if showSeasons.length > 0}
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6" in:fade={{ duration: 250 }}>
                    {#each showSeasons as season}
                        <div class="group flex flex-col overflow-hidden rounded-2xl border border-secondary/15 bg-light shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <div class="relative aspect-[2/3] w-full overflow-hidden bg-gray-900">
                                {#if season.poster_path}
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${season.poster_path}`}
                                        alt={season.name}
                                        loading="lazy"
                                        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                {:else}
                                    <div class="flex h-full w-full flex-col items-center justify-center p-3 text-center text-dark/30">
                                        <Icon icon="mdi:filmstrip-off" class="text-4xl mb-1" />
                                        <span class="text-[10px]">No Poster</span>
                                    </div>
                                {/if}
                            </div>
                            <div class="p-3">
                                <h3 class="text-xs font-bold text-dark truncate group-hover:text-primary transition-colors" title={season.name}>
                                    {season.name}
                                </h3>
                                <div class="mt-1 flex items-center justify-between text-[11px] text-dark/60">
                                    <span>{season.episode_count ? `${season.episode_count} eps` : ''}</span>
                                    <span>{season.air_date ? season.air_date.split('-')[0] : ''}</span>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="py-16 text-center text-dark/60">
                    <Icon icon="mdi:folder-off-outline" class="mx-auto text-5xl mb-2 opacity-40" />
                    <p class="font-medium">No seasons documented for this show.</p>
                </div>
            {/if}
        {/if}

        <!-- Cast -->
        {#if selectedTab === 'cast'}
            {#if showCast.length > 0}
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" in:fade={{ duration: 250 }}>
                    {#each showCast as member}
                        <div class="group flex flex-col overflow-hidden rounded-2xl border border-secondary/15 bg-light p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                            <div class="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-200 mb-2">
                                {#if member.profile_path}
                                    <img
                                        src={`https://image.tmdb.org/t/p/w342${member.profile_path}`}
                                        alt={member.name}
                                        loading="lazy"
                                        class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    />
                                {:else}
                                    <div class="flex h-full w-full items-center justify-center text-secondary/40">
                                        <Icon icon="mdi:account" class="text-3xl" />
                                    </div>
                                {/if}
                            </div>
                            <h3 class="text-xs font-bold text-dark truncate" title={member.name}>{member.name}</h3>
                            {#if member.character}
                                <p class="text-[11px] text-dark/60 truncate" title={member.character}>as {member.character}</p>
                            {/if}
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="py-16 text-center text-dark/60">
                    <Icon icon="mdi:account-off-outline" class="mx-auto text-5xl mb-2 opacity-40" />
                    <p class="font-medium">No cast information listed for this show.</p>
                </div>
            {/if}
        {/if}

        <!-- Crew -->
        {#if selectedTab === 'crew'}
            {#if showCrew.length > 0}
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" in:fade={{ duration: 250 }}>
                    {#each showCrew as member}
                        <div class="flex flex-col overflow-hidden rounded-2xl border border-secondary/15 bg-light p-3 text-center shadow-sm">
                            <div class="relative aspect-square w-full mb-3 overflow-hidden rounded-xl bg-gray-200">
                                {#if member.profile_path}
                                    <img
                                        src={`https://image.tmdb.org/t/p/w300${member.profile_path}`}
                                        alt={member.name}
                                        loading="lazy"
                                        class="h-full w-full object-cover"
                                    />
                                {:else}
                                    <div class="flex h-full w-full items-center justify-center text-dark/30">
                                        <Icon icon="mdi:account" class="text-4xl" />
                                    </div>
                                {/if}
                            </div>
                            <h3 class="text-xs font-bold text-dark truncate" title={member.name}>{member.name}</h3>
                            <p class="text-[11px] text-dark/60 truncate" title={member.job}>{member.job}</p>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="py-16 text-center text-dark/60">
                    <Icon icon="mdi:account-hard-hat-outline" class="mx-auto text-5xl mb-2 opacity-40" />
                    <p class="font-medium">No crew information listed for this show.</p>
                </div>
            {/if}
        {/if}

        <!-- Recommendations -->
        {#if selectedTab === 'recommendations'}
            {#if showRecommendations.length > 0}
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6" in:fade={{ duration: 250 }}>
                    {#each showRecommendations as rec}
                        <a
                            href={`/shows/${rec.id}`}
                            class="group flex flex-col overflow-hidden rounded-2xl border border-secondary/15 bg-light shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div class="relative aspect-[2/3] w-full overflow-hidden bg-gray-900">
                                {#if rec.poster_path}
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`}
                                        alt={rec.name}
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
                                <h3 class="text-xs font-bold text-dark truncate group-hover:text-primary transition-colors" title={rec.name}>
                                    {rec.name}
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
                    <p class="font-medium">No recommendations available for this show.</p>
                </div>
            {/if}
        {/if}
    </main>
{/if}

<FooterComponent />