<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { movieStore } from '$lib/stores/movie';
	import HeaderComponent from '$lib/components/Header.svelte';
	import FooterComponent from '$lib/components/Footer.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Icon from '@iconify/svelte';

	import type { Movie } from '$lib/types/Movie.ts';
	$: ({ movies, loading, error } = $movieStore);

	let searchQuery: string = '';
	let currentPage: number = 1;

	function goToNextPage() {
		// increment the current page
		currentPage += 1;
		movieStore.searchMovies(searchQuery, currentPage);
	}

	function goToPreviousPage() {
		currentPage -= 1;
		if (currentPage < 1) {
			currentPage = 1; // Prevent going below page 1
		}
		movieStore.searchMovies(searchQuery, currentPage);
	}

	const goToMovieDetails = (movie: Movie) => {
		goto(`/movies/${movie.ID}`);
	};

	let text = 'Welcome to Svelte Movies';
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

	const searchMovie = () => {
		if (searchQuery.trim() !== '') {
			movieStore.searchMovies(searchQuery, 1);
			currentPage = 1; // Reset to the first page
		}
	};
</script>

<svelte:head>
	<title>Movies - Browse Latest Movies</title>
	<meta
		name="description"
		content="Explore a collection of the latest movies, including genres, ratings, and more. Find your next favorite movie here!"
	/>
</svelte:head>

<HeaderComponent title="Movies" />
{#if loading}
	<Loader />
{:else if error}
	<p class="text-red-500">Error loading movies: {error.message}</p>
{:else}
	<div class="bg-accent-dark">
		<section
			class="relative h-[500px] bg-cover bg-center"
			style="background-image: url('https://plus.unsplash.com/premium_photo-1710409625244-e9ed7e98f67b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');"
		>
			<div
				class="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black via-transparent to-black"
			>
				<div class="text-center text-white">
					<h1 class="mb-4 text-4xl font-bold md:text-6xl">
						{displayedText}
					</h1>
					<p class="mb-6 text-lg md:text-xl">Discover your favorite movies and more</p>
					<div class="mx-auto flex justify-center">
						<input
							type="text"
							placeholder="Search for movies..."
							bind:value={searchQuery}
							class="text-midnight mr-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
						<button
							class="bg-midnight rounded-lg px-6 py-3 font-semibold text-white hover:bg-blue-700"
							on:click={() => searchMovie()}
						>
							Search
						</button>
					</div>
				</div>
			</div>
		</section>
		<div class="container mx-auto py-2">
			<div class="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
				{#each movies as movie (movie.id)}
					<div class="break-inside-avoid overflow-hidden rounded-lg bg-black shadow-lg">
						<img
							src={'https://image.tmdb.org/t/p/w500' + movie.poster_path}
							class="h-auto w-full"
							alt={movie.title}
						/>
						<div class="p-4">
							<h5 class="mb-2 text-lg font-bold text-white">{movie.title}</h5>
							<p class="mb-4 text-sm text-gray-300">{movie.overview}</p>
							<button
								class="bg-midnight rounded px-4 py-2 font-semibold text-white hover:bg-blue-700"
								on:click={() => goToMovieDetails(movie)}
							>
								View Details
							</button>
						</div>
					</div>
				{/each}
			</div>
			<div class="mt-4 mb-3 flex justify-center">
				<button
					class="bg-midnight hover:bg-midnight flex items-center rounded px-4 py-2 text-white disabled:opacity-50"
					on:click={goToPreviousPage}
					disabled={currentPage === 1}
				>
					<Icon icon="mdi:arrow-left" class="mr-2" />
					Previous
				</button>
				<button
					class="bg-midnight hover:bg-midnight mx-2 flex items-center rounded px-4 py-2 text-white disabled:opacity-50"
					on:click={goToNextPage}
				>
					Next
					<Icon icon="mdi:arrow-right" class="ml-2" />
				</button>
			</div>
		</div>
	</div>
{/if}

<FooterComponent />
