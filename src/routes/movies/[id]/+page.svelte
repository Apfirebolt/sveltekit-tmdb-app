<script lang="ts">
	import { fly } from 'svelte/transition';
	import HeaderComponent from '$lib/components/Header.svelte';
	import FooterComponent from '$lib/components/Footer.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import type { Movie } from '$lib/types/Movie.ts'; // Import as a type

	export let data; // Receive data from the load function in +page.server.ts

	$: movie = data.movie as Movie | null; // Assign data.movie to the movie variable.

	let displayedMovieName = '';
	let movieNameIndex = 0;

	// Typewriter effect logic for movie name
	const typeWriterMovieName = () => {
		if (movie && movieNameIndex < movie.Movie_Name.length) {
			displayedMovieName += movie.Movie_Name[movieNameIndex];
			movieNameIndex++;
			setTimeout(typeWriterMovieName, 100); // Adjust speed here
		}
	};

	// Start the typewriter effect when the movie data is available
	$: if (movie) {
		displayedMovieName = ''; // Reset displayed name
		movieNameIndex = 0; // Reset index
		typeWriterMovieName();
	}
</script>

<svelte:head>
	<title>{movie ? movie.Movie_Name : 'Loading...'}</title>
	<meta name="description" content={movie ? movie.Description : 'Loading movie details...'} />
</svelte:head>

<HeaderComponent title="Movie Details" />

{#if !movie}
	<Loader />
{:else}
	<section
		class="relative h-[500px] bg-cover bg-center"
		style="background-image: url('https://plus.unsplash.com/premium_photo-1710409625244-e9ed7e98f67b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');"
	>
		<div
			class="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black via-transparent to-black"
		>
			<div class="min-w-xl text-center text-white">
				<h1 class="mb-4 text-4xl font-bold md:text-6xl" in:fly={{ x: 300, duration: 500 }}>
					{displayedMovieName}
				</h1>
				<div class="rounded-lg bg-white p-4">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="rounded-lg bg-gray-100 p-4">
							<p class="font-semibold text-gray-600">Year:</p>
							<p class="text-gray-800">{movie.Year}</p>
						</div>
						<div class="rounded-lg bg-gray-200 p-4">
							<p class="font-semibold text-gray-600">Genre:</p>
							<p class="text-gray-800">{movie.Genre}</p>
						</div>
						<div class="rounded-lg bg-gray-100 p-4">
							<p class="font-semibold text-gray-600">Rating:</p>
							<p class="text-gray-800">{movie.Rating}</p>
						</div>
						<div class="rounded-lg bg-gray-200 p-4">
							<p class="font-semibold text-gray-600">Language:</p>
							<p class="text-gray-800">{movie.Language}</p>
						</div>
						<div class="rounded-lg bg-gray-100 p-4">
							<p class="font-semibold text-gray-600">Timing:</p>
							<p class="text-gray-800">{movie.Timing}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}

<FooterComponent />
