<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import HeaderComponent from '$lib/components/Header.svelte';
	import FooterComponent from '$lib/components/Footer.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import type { DetailedMovie } from '$lib/types/Movie.ts'; // Import as a type

	export let data; // Receive data from the load function in +page.server.ts

	$: movie = data.movie as DetailedMovie | null; // Assign data.movie to the movie variable.

	let displayedMovieName = '';
	let movieNameIndex = 0;

	let pageLoaded = false;

	// Trigger animation after the page loads
	onMount(() => {
		pageLoaded = true;
	});
</script>

<svelte:head>
	<title>{movie ? movie.title : 'Loading...'}</title>
	<meta name="description" content={movie ? movie.overview : 'Loading...'} />
</svelte:head>

<HeaderComponent title={movie ? `${movie.title}` : 'Movie Details'} />

{#if !movie}
	<Loader />
{:else}
	<section
		class="relative h-[500px] bg-center bg-no-repeat"
		style="background-image: url('https://image.tmdb.org/t/p/original{movie.poster_path}');"
	>
		<div
			class="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black via-transparent to-black"
		>
			<div class="min-w-xl text-center text-white">
			</div>
		</div>
	</section>

	<div
		class="container mx-auto text-center text-dark my-5"
		in:fly={{ y: 50, duration: 500 }}
	>
		<h1 class="text-4xl font-bold mb-4">{movie.title}</h1>
		<p class="text-lg mb-6">{movie.overview}</p>

		<div class="grid grid-cols-1 text-dark md:grid-cols-3 gap-4">
			<div class="p-4 bg-light rounded shadow">
				<h2 class="text-xl font-semibold mb-2">Release Date</h2>
				<p>{movie.release_date}</p>
			</div>
			<div class="p-4 bg-light rounded shadow">
				<h2 class="text-xl font-semibold mb-2">Rating</h2>
				<p>{movie.vote_average} / 10</p>
			</div>
			<div class="p-4 bg-light rounded shadow">
				<h2 class="text-xl font-semibold mb-2">Genres</h2>
				<p>{movie.genres.map(genre => genre.name).join(', ')}</p>
			</div>

			<div class="p-4 bg-light rounded shadow">
				<h2 class="text-xl font-semibold mb-2">Runtime</h2>
				<p>{movie.runtime} minutes</p>
			</div>
			<div class="p-4 bg-light rounded shadow">
				<h2 class="text-xl font-semibold mb-2">Production Companies</h2>
				<p>{movie.production_companies.map(company => company.name).join(', ')}</p>
			</div>
			<div class="p-4 bg-light rounded shadow">
				<h2 class="text-xl font-semibold mb-2">Spoken Languages</h2>
				<p>{movie.spoken_languages.map(language => language.name).join(', ')}</p>
			</div>
		</div>
	</div>
{/if}

<FooterComponent />
