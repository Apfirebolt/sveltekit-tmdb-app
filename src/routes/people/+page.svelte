<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
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
	let showPeople: boolean = false; // Control when to show people
	let debounceTimer: NodeJS.Timeout | null = null;
	const DEBOUNCE_DELAY = 300; // milliseconds

	$: if (!loading && !error && people.length > 0) {
		// Set showPeople to true once data is loaded
		showPeople = true;
	} else {
		showPeople = false; // Hide people if loading or error occurs
	}

	function goToNextPage() {
		// increment the current page
		currentPage += 1;
		peopleStore.searchPeople(searchQuery, currentPage);
	}

	function goToPreviousPage() {
		currentPage -= 1;
		if (currentPage < 1) {
			currentPage = 1; // Prevent going below page 1
		}
		peopleStore.searchPeople(searchQuery, currentPage);
	}

	const goToPersonDetails = (person: Person) => {
		goto(`/people/${person.id}`);
	};

	let text = 'Welcome to TMDB People App';
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

	const searchPerson = () => {
		if (searchQuery.trim() !== '') {
			peopleStore.searchPeople(searchQuery, 1);
			currentPage = 1; // Reset to the first page
			showSuggestions = false; // Hide suggestions after search
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
			} catch (error) {
				console.error('Error fetching typeahead suggestions:', error);
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
		showSuggestions = false; // Hide suggestions on new input
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
		// Slight delay to allow click on suggestion to register
		setTimeout(() => {
			showSuggestions = false;
		}, 100);
	};

	// Fetch popular people on component mount
	onMount(() => {
		peopleStore.getPopularPeople(currentPage);
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
	<Loader />
{:else if error}
	<p class="text-red-500">Error loading people: {error.message}</p>
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
					<p class="mb-6 text-lg md:text-xl">Discover your favorite celebrities and more</p>
					<div class="mx-auto flex justify-center">
						<div
							class="bg-light flex items-center justify-center rounded-3xl px-2 py-3 shadow-lg md:w-full"
						>
							<div class="relative mx-2 md:w-3/4">
								<input
									type="text"
									placeholder="Search for people..."
									bind:value={searchQuery}
									class="text-secondary w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
									on:input={handleInputChange}
									on:blur={handleBlur}
								/>
								<Icon
									icon="mdi:magnify"
									class="text-secondary absolute top-1/2 left-3 -translate-y-1/2 transform text-xl"
								/>
								{#if showSuggestions && typeAheadSuggestions.length > 0}
									<ul class="bg-light absolute right-0 left-0 z-10 mt-1 rounded-md shadow-lg">
										{#each typeAheadSuggestions as suggestion}
											<button
												type="button"
												class="text-secondary w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
												on:click={() => selectSuggestion(suggestion)}
											>
												{suggestion}
											</button>
										{/each}
									</ul>
								{/if}
								{#if isFetchingSuggestions && searchQuery.trim() !== ''}
									<div
										class="bg-light absolute right-0 left-0 z-10 mt-1 rounded-md px-4 py-2 text-gray-500"
									>
										Loading suggestions...
									</div>
								{/if}
							</div>
							<button
								class="bg-secondary text-light flex items-center rounded-lg px-6 py-3 text-sm font-semibold hover:bg-blue-700"
								on:click={() => searchPerson()}
								disabled={isFetchingSuggestions}
							>
								<Icon icon="mdi:magnify" class="mr-2 text-lg" />
								Search
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
		<div class="container mx-auto py-2">
			{#if people.length > 0}
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					totalResults={totalResults}
					goToPreviousPage={goToPreviousPage}
					goToNextPage={goToNextPage}
				/>
			{:else if !loading && !error}
				<p class="text-light text-center">No results found for "{searchQuery}"</p>
			{/if}
			<div
				class="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3"
				in:fly={{ y: 50, duration: 500 }}
			>
				{#if showPeople}
					{#each people as person (person.id)}
						<div class="bg-dark break-inside-avoid overflow-hidden rounded-lg shadow-lg">
							{#if person.profile_path}
								<img
									src={'https://image.tmdb.org/t/p/w500' + person.profile_path}
									class="h-auto w-full"
									alt={person.name}
								/>
							{:else}
								<div class="flex h-64 items-center justify-center bg-gray-800 font-bold text-white">
									No image is available
								</div>
							{/if}
							<div class="p-4">
								<h5 class="my-4 text-center text-3xl font-bold text-white">{person.name}</h5>
								<p class="mb-4 text-sm text-gray-300">Known for: {person.known_for_department}</p>
								<button
									class="bg-secondary hover:bg-danger hover:text-light rounded px-4 py-2 font-semibold text-white transition-colors duration-300"
									on:click={() => goToPersonDetails(person)}
								>
									View Details
								</button>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}

<FooterComponent />
