<script>
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import apiClient from '$lib/plugins/interceptor';
	import HeaderComponent from '$lib/components/Header.svelte';
	import FooterComponent from '$lib/components/Footer.svelte';

	let text = 'Welcome to TMDB App';
	let displayedText = '';
	let index = 0;
	let providers = [];
	let tvProviders = [];
	let regions = [];
	let loading = true;
	let selectedTab = 'regions';

	let tabs = [
		{ name: 'providers', label: 'Providers', selected: true },
		{ name: 'tv_providers', label: 'TV Providers', selected: false },
		{ name: 'regions', label: 'Regions', selected: false }
	];

	// Typewriter effect logic
	const typeWriter = () => {
		if (index < text.length) {
			displayedText += text[index];
			index++;
			setTimeout(typeWriter, 100); // Adjust speed here
		}
	};

	// Start the typewriter effect when the component is mounted
	typeWriter();

	const getRegions = async () => {
		try {
			const response = await apiClient.get(
				`watch/providers/regions?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			regions = response.data.results;
		} catch (error) {
			console.error('Error fetching regions:', error);
		}
	};

	const getTVProviders = async () => {
		try {
			const response = await apiClient.get(
				`watch/providers/tv?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			tvProviders = response.data.results;
		} catch (error) {
			console.error('Error fetching TV providers:', error);
		}
	};

	const getMovieProviders = async () => {
		try {
			const response = await apiClient.get(
				`watch/providers/movie?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			providers = response.data.results;
		} catch (error) {
			console.error('Error fetching movie providers:', error);
		}
	};

	onMount(async () => {
		await getRegions();
		await getTVProviders();
		await getMovieProviders();
		loading = false;
	});
</script>

<HeaderComponent title="About Sveltekit TMDB App" />

<section
	class="relative h-[500px] bg-cover bg-center"
	style="background-image: url('https://static1.srcdn.com/wordpress/wp-content/uploads/2018/07/Dragon-Ball-Super-Broly-header.jpg');"
>
	<div
		class="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black via-transparent to-black"
	>
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

<!-- Tabs -->
<div class="container mx-auto rounded-lg bg-white text-secondary p-4 shadow-lg">
    <h2 class="mb-2 text-xl font-bold">Select Tab</h2>
    <div class="flex space-x-2">
        {#each tabs as tab}
            <button
                class="rounded-lg px-4 py-2 {tab.selected
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-800'}"
                on:click={() => {
                    tabs.forEach((t) => (t.selected = false));
                    tab.selected = true;
                    selectedTab = tab.name;
                }}
            >
                {tab.label}
            </button>
        {/each}
    </div>
</div>

<!-- Movie Providers -->
{#if selectedTab === 'providers'}
<section class="py-10">
    <div class="container mx-auto">
        <h2 class="mb-6 text-3xl font-bold">Movie Providers</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each providers as provider}
                <div class="rounded-lg bg-white p-4 shadow-lg">
                    <h3 class="text-xl font-semibold">{provider.provider_name}</h3>
                    <p>Region: {provider.iso_3166_1}</p>
                    {#if provider.logo_path}
                        <img
                            src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`}
                            alt={provider.provider_name}
                            class="mt-2"
                        />
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</section>
{/if}

<!-- TV Providers -->
{#if selectedTab === 'tv_providers'}
<section class="py-10">
    <div class="container mx-auto">
        <h2 class="mb-6 text-3xl font-bold">TV Providers</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each tvProviders as provider}
                <div class="rounded-lg bg-white p-4 shadow-lg">
                    <h3 class="text-xl font-semibold">{provider.provider_name}</h3>
                    <p>Region: {provider.iso_3166_1}</p>
                    {#if provider.logo_path}
                        <img
                            src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`}
                            alt={provider.provider_name}
                            class="mt-2"
                        />
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</section>
{/if}

<!-- Regions -->
{#if selectedTab === 'regions'}
<section class="py-10">
    <div class="container mx-auto">
        <h2 class="mb-6 text-3xl font-bold">Regions</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each regions as region}
                <div class="rounded-lg bg-white p-4 shadow-lg">
                    <h3 class="text-xl font-semibold">{region.english_name}</h3>
                    <p>Code: {region.iso_3166_1}</p>
                </div>
            {/each}
        </div>
    </div>
</section>
{/if}

<FooterComponent />
