<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import apiClient from '$lib/plugins/interceptor';
	import { discoverStore } from '$lib/stores/discover';
	import HeaderComponent from '$lib/components/Header.svelte';
	import FooterComponent from '$lib/components/Footer.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Icon from '@iconify/svelte';

	import type { DiscoverResponse, MovieResult } from '$lib/types/Discover.ts';

	$: ({ items, loading, totalPages, totalResults, error } = $discoverStore);

	let searchQuery: string = '';
	let currentPage: number = 1;
	let isFetchingSuggestions: boolean = false;

	let text = 'Welcome to Discoveries';
	let displayedText = '';
	let index = 0;

	// Typewriter effect logic
	const typeWriter = () => {
		if (index < text.length) {
			displayedText += text[index];
			index++;
			setTimeout(typeWriter, 100); // Adjust speed here
		}
	};

	const goToNextPage = () => {
		currentPage += 1;
		discoverStore.fetchDiscoverItems(searchQuery, currentPage);
	};

	const goToPreviousPage = () => {
		currentPage -= 1;
		if (currentPage < 1) {
			currentPage = 1;
		}
		discoverStore.fetchDiscoverItems(searchQuery, currentPage);
	};

	// Start the typewriter effect when the component is mounted
	typeWriter();

	const searchDiscover = () => {
		if (searchQuery.trim() !== '') {
			discoverStore.fetchDiscoverItems(searchQuery, 1);
			currentPage = 1;
		}
	};

	onMount(() => {
		discoverStore.fetchDiscoverItems('movie', currentPage);
	});
</script>

<svelte:head>
	<title>Discover - Browse through discoveries</title>
	<meta
		name="description"
		content="Explore a collection of the latest movies, including genres, ratings, and more. Find your next favorite movie here!"
	/>
</svelte:head>

<HeaderComponent title="Discover" />
{#if loading}
	<Loader />
{:else if error}
	<p class="text-red-500">Error loading discoveries: {error.message}</p>
{:else}
	<div class="bg-accent text-dark">
		<section
			class="relative h-[500px] w-full bg-cover bg-center"
			style="background-image: url('https://img10.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/5313/1734078555313-i');"
		>
			<div
				class="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black via-transparent to-black"
			>
				<div class="text-light w-3/5 text-center">
					<h1 class="mb-4 text-4xl font-bold md:text-6xl" in:fly={{ y: 50, duration: 500 }}>
						{displayedText}
					</h1>
					<p class="mb-6 text-lg md:text-xl">Discover your favorite movies and more</p>
					<div class="mx-auto flex justify-center">
						<div
							class="bg-light flex items-center justify-center rounded-3xl px-2 py-3 shadow-lg md:w-full"
						>
							<select
								class="rounded-lg border w-64 border-gray-300 bg-white px-4 py-2 text-dark focus:outline-none focus:ring-2 focus:ring-secondary"
								bind:value={searchQuery}
								on:change={searchDiscover}
							>
								<option value="movie">Movies</option>
								<option value="tv">TV Shows</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</section>

		<div class="container mx-auto py-2">
			{#if items.length > 0}
				<div class="mt-4 mb-3 flex items-center justify-center">
					<p class="text-dark mx-2 mb-2 text-lg">
						Page {currentPage} of {totalPages} | Total Results: {totalResults}
					</p>
					<div class="flex justify-center">
						<button
							class="bg-secondary hover:bg-secondary flex items-center rounded px-4 py-2 text-white disabled:opacity-50"
							on:click={goToPreviousPage}
							disabled={currentPage === 1}
						>
							<Icon icon="mdi:arrow-left" class="mr-2" />
							Previous
						</button>
						<button
							class="bg-secondary hover:bg-secondary mx-2 flex items-center rounded px-4 py-2 text-white disabled:opacity-50"
							on:click={goToNextPage}
							disabled={currentPage === totalPages}
						>
							Next
							<Icon icon="mdi:arrow-right" class="ml-2" />
						</button>
					</div>
				</div>
			{/if}
			<div
				class="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3"
				in:fly={{ y: 50, duration: 500 }}
			>
				{#each items as discovery (discovery.id)}
					<div class="bg-dark break-inside-avoid overflow-hidden rounded-lg shadow-lg">
						<div class="p-4">
							<h2 class="text-2xl font-bold text-light mt-2">{discovery.original_title}</h2>
							<p class="text-sm">ID: {discovery.id}</p>
							{#if discovery.backdrop_path}
								<img
									src={`https://image.tmdb.org/t/p/w500${discovery.backdrop_path}`}
									alt={discovery.original_title}
									class="mb-4 w-full rounded-lg"
								/>
							{:else}
								<p class="text-light text-center text-2xl my-3">No image available</p>
							{/if}
							{#if discovery.overview}
								<p class="mb-2 text-sm text-gray-300">{discovery.overview}</p>
							{:else}
								<p class="mb-2 text-sm text-gray-300">No overview available</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<FooterComponent />
