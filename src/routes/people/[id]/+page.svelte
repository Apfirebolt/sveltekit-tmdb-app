<script lang="ts">
    import { onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    import HeaderComponent from '$lib/components/Header.svelte';
    import FooterComponent from '$lib/components/Footer.svelte';
    import Loader from '$lib/components/Loader.svelte';
    import apiClient from '$lib/plugins/interceptor.js';
    import Icon from '@iconify/svelte';
    import type { DetailedPerson, Image, ImageResponse, TaggedImageResponse, TaggedImage } from '$lib/types/People.ts';

    export let data;

    $: person = data.person as DetailedPerson | null;

    let personImages: Image[] = [];
    let taggedImages: TaggedImage[] = [];
    let combinedCredits: any[] = [];
    let selectedTab = 'images';

    const tabs = [
        { name: 'images', label: 'Portraits', icon: 'mdi:camera-outline' },
        { name: 'tagged', label: 'Tagged Photos', icon: 'mdi:image-filter-frames' },
        { name: 'combined', label: 'Filmography', icon: 'mdi:filmstrip' }
    ];

    const selectTab = (tab: string) => {
        selectedTab = tab;
    };

    const getPersonImages = async (personId: string | number) => {
        try {
            const response = await apiClient.get<ImageResponse>(
                `/person/${personId}/images?api_key=${import.meta.env.VITE_APP_KEY}`
            );
            if (response.data?.profiles) {
                personImages = response.data.profiles;
            }
        } catch (error) {
            console.error('Error fetching person images:', error);
        }
    };

    const getTaggedImages = async (personId: string | number) => {
        try {
            const response = await apiClient.get<TaggedImageResponse>(
                `/person/${personId}/tagged_images?api_key=${import.meta.env.VITE_APP_KEY}`
            );
            if (response.data?.results) {
                taggedImages = response.data.results;
            }
        } catch (error) {
            console.error('Error fetching tagged images:', error);
        }
    };

    const getCombinedCredits = async (personId: string | number) => {
        try {
            const response = await apiClient.get(
                `/person/${personId}/combined_credits?api_key=${import.meta.env.VITE_APP_KEY}`
            );
            if (response.data?.cast) {
                combinedCredits = response.data.cast;
            }
        } catch (error) {
            console.error('Error fetching credits:', error);
        }
    };

    onMount(() => {
        if (person?.id) {
            Promise.all([
                getPersonImages(person.id),
                getTaggedImages(person.id),
                getCombinedCredits(person.id)
            ]);
        }
    });
</script>

<svelte:head>
    <title>{person ? person.name : 'Loading...'} - TMDB</title>
    <meta name="description" content={person?.biography || 'Person Profile'} />
</svelte:head>

<HeaderComponent title={person ? person.name : 'Person Details'} />

{#if !person}
    <div class="flex min-h-[70vh] items-center justify-center">
        <Loader />
    </div>
{:else}
    <!-- Profile Backdrop Hero -->
    <div class="relative w-full overflow-hidden bg-dark text-light">
        <div
            class="absolute inset-0 bg-cover bg-center filter blur-xl opacity-25 scale-110"
            style="background-image: url('https://image.tmdb.org/t/p/w780{person.profile_path}');"
        ></div>
        <div class="absolute inset-0 bg-gradient-to-t from-dark via-dark/85 to-dark/60"></div>

        <div class="container relative z-10 mx-auto px-4 py-12 md:py-16 lg:px-8">
            <div class="flex flex-col md:flex-row gap-8 lg:gap-12 items-start" in:fly={{ y: 30, duration: 600 }}>
                <!-- Profile Portrait Frame -->
                <div class="w-48 sm:w-56 md:w-72 shrink-0 mx-auto md:mx-0 shadow-2xl rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                    {#if person.profile_path}
                        <img
                            src={`https://image.tmdb.org/t/p/w780${person.profile_path}`}
                            alt={person.name}
                            class="w-full h-auto aspect-[2/3] object-cover object-top"
                        />
                    {:else}
                        <div class="aspect-[2/3] flex flex-col items-center justify-center p-6 text-light/40 text-center">
                            <Icon icon="mdi:account" class="text-5xl mb-2" />
                            <span class="text-sm">Photo unavailable</span>
                        </div>
                    {/if}
                </div>

                <!-- Bio & Primary Statistics -->
                <div class="flex-1 text-left">
                    <div class="flex flex-wrap items-center gap-2 mb-3">
                        <span class="px-3 py-1 text-xs font-semibold rounded-md bg-secondary text-light shadow-sm">
                            {person.known_for_department || 'Artist'}
                        </span>
                        {#if person.birthday}
                            <span class="px-2.5 py-1 text-xs font-medium rounded-md bg-white/10 backdrop-blur-md border border-white/15">
                                Born: {person.birthday}
                            </span>
                        {/if}
                        {#if person.popularity}
                            <span class="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-white/10 backdrop-blur-md border border-white/15">
                                <Icon icon="mdi:fire" class="text-amber-400 text-sm" />
                                {person.popularity.toFixed(1)} Pop.
                            </span>
                        {/if}
                    </div>

                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
                        {person.name}
                    </h1>

                    <div class="mb-6">
                        <h2 class="text-xs uppercase tracking-wider text-light/60 font-semibold mb-2">Biography</h2>
                        <p class="text-sm sm:text-base leading-relaxed text-light/85 max-w-3xl line-clamp-6 hover:line-clamp-none transition-all">
                            {person.biography || 'No biographical information is currently registered for this individual.'}
                        </p>
                    </div>

                    <!-- Meta Detail Cards -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-6 border-t border-white/10 text-xs">
                        {#if person.place_of_birth}
                            <div class="p-3 rounded-xl bg-white/5 border border-white/10">
                                <span class="text-light/50 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Birthplace</span>
                                <span class="font-medium text-light">{person.place_of_birth}</span>
                            </div>
                        {/if}

                        {#if person.also_known_as?.length}
                            <div class="p-3 rounded-xl bg-white/5 border border-white/10 sm:col-span-2">
                                <span class="text-light/50 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Also Known As</span>
                                <span class="font-medium text-light line-clamp-1" title={person.also_known_as.join(', ')}>
                                    {person.also_known_as.slice(0, 3).join(', ')}
                                </span>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Media Tab Switcher -->
    <div class="sticky top-20 z-30 border-b border-secondary/15 bg-light/95 backdrop-blur-md">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav class="flex space-x-2 sm:space-x-4 overflow-x-auto py-3 no-scrollbar" aria-label="Person Media">
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

    <!-- Tab Panels -->
    <main class="container mx-auto min-h-[420px] px-4 py-10 sm:px-6 lg:px-8">
        <!-- Person Images -->
        {#if selectedTab === 'images'}
            {#if personImages.length > 0}
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" in:fade={{ duration: 250 }}>
                    {#each personImages as image}
                        <div class="group relative aspect-[2/3] overflow-hidden rounded-2xl bg-dark shadow-sm border border-secondary/15">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                                alt="Portrait of {person.name}"
                                loading="lazy"
                                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="py-16 text-center text-dark/60">
                    <Icon icon="mdi:camera-off-outline" class="mx-auto text-5xl mb-2 opacity-40" />
                    <p class="font-medium">No portraits available for this person.</p>
                </div>
            {/if}
        {/if}

        <!-- Tagged Images -->
        {#if selectedTab === 'tagged'}
            {#if taggedImages.length > 0}
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" in:fade={{ duration: 250 }}>
                    {#each taggedImages as image}
                        <div class="group relative aspect-video overflow-hidden rounded-2xl bg-dark shadow-sm border border-secondary/15">
                            <img
                                src={`https://image.tmdb.org/t/p/w780${image.file_path}`}
                                alt="Tagged scene"
                                loading="lazy"
                                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {#if image.media?.title || image.media?.name}
                                <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                    <p class="text-xs font-semibold text-light truncate">
                                        {image.media?.title || image.media?.name}
                                    </p>
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="py-16 text-center text-dark/60">
                    <Icon icon="mdi:image-off-outline" class="mx-auto text-5xl mb-2 opacity-40" />
                    <p class="font-medium">No tagged scene captures found.</p>
                </div>
            {/if}
        {/if}

        <!-- Filmography / Combined Credits -->
        {#if selectedTab === 'combined'}
            {#if combinedCredits.length > 0}
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" in:fade={{ duration: 250 }}>
                    {#each combinedCredits as credit}
                        <a
                            href={credit.media_type === 'tv' ? `/shows/${credit.id}` : `/movies/${credit.id}`}
                            class="group flex flex-col overflow-hidden rounded-2xl border border-secondary/15 bg-light shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                        >
                            <div class="relative aspect-[2/3] w-full overflow-hidden bg-gray-900">
                                {#if credit.poster_path}
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${credit.poster_path}`}
                                        alt={credit.title || credit.name}
                                        loading="lazy"
                                        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                {:else}
                                    <div class="flex h-full w-full flex-col items-center justify-center p-3 text-center text-dark/30">
                                        <Icon icon="mdi:filmstrip-off" class="text-3xl mb-1" />
                                        <span class="text-[10px]">No Poster</span>
                                    </div>
                                {/if}

                                <div class="absolute top-2 right-2 rounded-md bg-dark/70 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-bold text-light uppercase tracking-wider">
                                    {credit.media_type || 'Movie'}
                                </div>
                            </div>

                            <div class="p-3 flex flex-1 flex-col justify-between">
                                <div>
                                    <h3
                                        class="text-xs font-bold text-dark line-clamp-1 group-hover:text-primary transition-colors"
                                        title={credit.title || credit.name}
                                    >
                                        {credit.title || credit.name}
                                    </h3>
                                    {#if credit.character}
                                        <p class="mt-0.5 text-[11px] text-dark/65 line-clamp-1" title={credit.character}>
                                            <span class="text-[10px] text-dark/40 font-normal">as</span> {credit.character}
                                        </p>
                                    {/if}
                                </div>

                                <div class="mt-2 pt-2 border-t border-secondary/10 flex items-center justify-between text-[11px] text-dark/50">
                                    <span>
                                        {(credit.release_date || credit.first_air_date || '').split('-')[0] || 'TBA'}
                                    </span>
                                    {#if credit.vote_average}
                                        <span class="flex items-center gap-0.5 font-semibold text-dark/70">
                                            <Icon icon="mdi:star" class="text-yellow-500 text-xs" />
                                            {credit.vote_average.toFixed(1)}
                                        </span>
                                    {/if}
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            {:else}
                <div class="py-16 text-center text-dark/60">
                    <Icon icon="mdi:filmstrip-off" class="mx-auto text-5xl mb-2 opacity-40" />
                    <p class="font-medium">No credited filmography works found.</p>
                </div>
            {/if}
        {/if}
    </main>
{/if}

<FooterComponent />