<script lang="ts">
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
	let showMovies: boolean = false; // Control when to show movies

	$: if (!loading && !error && movies.length > 0) {
		// Set showMovies to true once data is loaded
		showMovies = true;
	} else {
		showMovies = false; // Hide movies if loading or error occurs
	}

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
		goto(`/movies/${movie.id}`);
	};

	let text = 'Welcome to TMDB Movies App';
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
	<div class="bg-accent text-dark">
		<section
			class="relative h-[500px] bg-cover w-full bg-center"
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
							<div class="relative mx-2 w-3/4">
								<input
									type="text"
									placeholder="Search for movies..."
									bind:value={searchQuery}
									class="text-secondary w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
								/>
								<Icon
									icon="mdi:magnify"
									class="text-secondary absolute top-1/2 left-3 -translate-y-1/2 transform text-xl"
								/>
							</div>
							<button
								class="bg-secondary text-light flex items-center text-sm rounded-lg px-6 py-3 font-semibold hover:bg-blue-700"
								on:click={() => searchMovie()}
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
			{#if movies.length > 0}
				<div class="mt-4 mb-3 flex justify-center">
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
					>
						Next
						<Icon icon="mdi:arrow-right" class="ml-2" />
					</button>
				</div>
			{/if}
			<div
				class="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3"
				in:fly={{ y: 50, duration: 500 }}
			>
				{#if showMovies}
					{#each movies as movie (movie.id)}
						<div class="bg-dark break-inside-avoid overflow-hidden rounded-lg shadow-lg">
							{#if movie.poster_path}
								<img
									src={'https://image.tmdb.org/t/p/w500' + movie.poster_path}
									class="h-auto w-full"
									alt={movie.title}
								/>
							{:else}
								<div class="flex h-64 items-center justify-center bg-gray-800 font-bold text-white">
									No image is available
								</div>
							{/if}
							<div class="p-4">
								<h5 class="my-4 text-center text-3xl font-bold text-white">{movie.title}</h5>
								<p class="mb-4 text-sm text-gray-300">{movie.overview}</p>
								<button
									class="bg-secondary rounded px-4 py-2 font-semibold text-white hover:bg-blue-700"
									on:click={() => goToMovieDetails(movie)}
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
