<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import apiClient from '$lib/plugins/interceptor';
	import { collectionStore } from '$lib/stores/collection';
	import HeaderComponent from '$lib/components/Header.svelte';
	import FooterComponent from '$lib/components/Footer.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Icon from '@iconify/svelte';

	import type { Collection, Result } from '$lib/types/Collection.ts';

	$: ({ collections, loading, totalPages, totalResults, error } = collectionStore);

	let searchQuery: string = '';
	let currentPage: number = 1;
	let typeAheadSuggestions: string[] = [];
	let showSuggestions: boolean = false;
	let isFetchingSuggestions: boolean = false;
	let showCollections: boolean = false; 
	let debounceTimer: NodeJS.Timeout | null = null;
	const DEBOUNCE_DELAY = 300; // milliseconds


	let text = 'Welcome to Collections';
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

	// Start the typewriter effect when the component is mounted
	typeWriter();

	const searchCollection = () => {
		if (searchQuery.trim() !== '') {
			collectionStore.searchCollections(searchQuery, 1);
			currentPage = 1; // Reset to the first page
			showSuggestions = false; // Hide suggestions after search
		}
	};

	
</script>

<svelte:head>
	<title>Collections - Browse through collections</title>
	<meta
		name="description"
		content="Explore a collection of the latest movies, including genres, ratings, and more. Find your next favorite movie here!"
	/>
</svelte:head>

<HeaderComponent title="Collections" />
{#if loading}
	<Loader />
{:else if error}
	<p class="text-red-500">Error loading collections: {error.message}</p>
{:else}
	<div class="bg-accent text-dark">
		<p>
			Collection Page
		</p>
	</div>
					
{/if}

<FooterComponent />
