<script>
    import { fly } from 'svelte/transition';
    import { onMount, onDestroy } from 'svelte';
    import apiClient from '$lib/plugins/interceptor';
    import HeaderComponent from '$lib/components/Header.svelte';
    import FooterComponent from '$lib/components/Footer.svelte';

    const fullText = 'Welcome to TMDB App';
    let displayedText = '';
    let typewriterTimer;

    let providers = [];
    let tvProviders = [];
    let regions = [];
    let loading = true;
    let selectedTab = 'regions';

    const tabs = [
        { id: 'providers', label: 'Providers' },
        { id: 'tv_providers', label: 'TV Providers' },
        { id: 'regions', label: 'Regions' }
    ];

    const startTypewriter = () => {
        let i = 0;
        const step = () => {
            if (i < fullText.length) {
                displayedText += fullText[i];
                i++;
                typewriterTimer = setTimeout(step, 100);
            }
        };
        step();
    };

    onMount(async () => {
        startTypewriter();

        const apiKey = import.meta.env.VITE_APP_KEY;
        try {
            const [regRes, tvRes, movieRes] = await Promise.all([
                apiClient.get(`watch/providers/regions?api_key=${apiKey}`),
                apiClient.get(`watch/providers/tv?api_key=${apiKey}`),
                apiClient.get(`watch/providers/movie?api_key=${apiKey}`)
            ]);

            regions = regRes.data.results || [];
            tvProviders = tvRes.data.results || [];
            providers = movieRes.data.results || [];
        } catch (error) {
            console.error('Failed to load provider data:', error);
        } finally {
            loading = false;
        }
    });

    onDestroy(() => {
        if (typewriterTimer) clearTimeout(typewriterTimer);
    });
</script>

<HeaderComponent title="About Sveltekit TMDB App" />

<!-- Hero Section -->
<section
    class="relative h-[500px] bg-cover bg-center"
    style="background-image: url('https://static1.srcdn.com/wordpress/wp-content/uploads/2018/07/Dragon-Ball-Super-Broly-header.jpg');"
>
    <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/50 via-transparent to-black/50">
        <div class="text-center text-white">
            <h1 class="mb-4 text-4xl font-bold md:text-6xl" in:fly={{ x: -200, duration: 500 }}>
                {displayedText}
            </h1>
            <p class="mb-6 text-lg md:text-xl" in:fly={{ x: -200, duration: 500, delay: 200 }}>
                Discover your favorite movies and more
            </p>
        </div>
    </div>
</section>

<!-- Tab Navigation -->
<div class="container mx-auto mt-6 rounded-lg bg-white p-4 shadow-lg text-secondary">
    <h2 class="mb-2 text-xl font-bold">Select Tab</h2>
    <div class="flex space-x-2">
        {#each tabs as tab}
            <button
                class="rounded-lg px-4 py-2 font-medium transition-colors {selectedTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}"
                on:click={() => (selectedTab = tab.id)}
            >
                {tab.label}
            </button>
        {/each}
    </div>
</div>

<!-- Main Content Area -->
<section class="py-10">
    <div class="container mx-auto">
        {#if loading}
            <div class="flex justify-center py-12">
                <p class="text-lg font-semibold text-gray-600">Loading data...</p>
            </div>
        {:else if selectedTab === 'providers'}
            <h2 class="mb-6 text-3xl font-bold">Movie Providers</h2>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {#each providers as provider}
                    <div class="flex flex-col items-center rounded-lg bg-white p-4 text-center shadow-lg">
                        {#if provider.logo_path}
                            <img
                                src={`https://image.tmdb.org/t/p/w185${provider.logo_path}`}
                                alt={provider.provider_name}
                                class="mb-3 h-16 w-16 rounded-xl object-contain shadow-sm"
                                loading="lazy"
                            />
                        {/if}
                        <h3 class="text-lg font-semibold">{provider.provider_name}</h3>
                        <p class="text-sm text-gray-500">Region: {provider.iso_3166_1 || 'Global'}</p>
                    </div>
                {/each}
            </div>
        {:else if selectedTab === 'tv_providers'}
            <h2 class="mb-6 text-3xl font-bold">TV Providers</h2>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {#each tvProviders as provider}
                    <div class="flex flex-col items-center rounded-lg bg-white p-4 text-center shadow-lg">
                        {#if provider.logo_path}
                            <img
                                src={`https://image.tmdb.org/t/p/w185${provider.logo_path}`}
                                alt={provider.provider_name}
                                class="mb-3 h-16 w-16 rounded-xl object-contain shadow-sm"
                                loading="lazy"
                            />
                        {/if}
                        <h3 class="text-lg font-semibold">{provider.provider_name}</h3>
                        <p class="text-sm text-gray-500">Region: {provider.iso_3166_1 || 'Global'}</p>
                    </div>
                {/each}
            </div>
        {:else if selectedTab === 'regions'}
            <h2 class="mb-6 text-3xl font-bold">Regions</h2>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {#each regions as region}
                    <div class="rounded-lg bg-white p-4 shadow-lg">
                        <h3 class="text-xl font-semibold">{region.english_name}</h3>
                        <p class="text-sm text-gray-500">Code: {region.iso_3166_1}</p>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</section>

<FooterComponent />