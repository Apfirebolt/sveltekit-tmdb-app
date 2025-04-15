<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import HeaderComponent from '$lib/components/Header.svelte';
	import FooterComponent from '$lib/components/Footer.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import type { DetailedTVShow } from '$lib/types/Show.ts'; // Import as a type

	export let data; // Receive data from the load function in +page.server.ts

	$: tvShow = data.show as DetailedTVShow | null; // Assign data.tvShow to the tvShow variable.

	let displayedShowName = '';
	let showNameIndex = 0;

	let pageLoaded = false;

	// Trigger animation after the page loads
	onMount(() => {
		pageLoaded = true;
	});
</script>

<svelte:head>
	<title>{tvShow ? tvShow.name : 'Loading...'}</title>
	<meta name="description" content={tvShow ? tvShow.overview : 'Loading...'} />
</svelte:head>

<HeaderComponent title={tvShow ? `${tvShow.name}` : 'TV Show Details'} />

{#if !tvShow}
	<Loader />
{:else}
	<section
		class="relative h-[500px] bg-center bg-no-repeat"
		style="background-image: url('https://image.tmdb.org/t/p/original{tvShow.poster_path}');"
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
		<h1 class="text-4xl font-bold mb-4">{tvShow.name}</h1>
		<p class="text-lg mb-6">{tvShow.overview}</p>

		<div class="grid grid-cols-1 text-dark md:grid-cols-3 gap-4">
			<div class="p-4 bg-light rounded shadow">
				<h2 class="text-xl font-semibold mb-2">First Air Date</h2>
				<p>{tvShow.first_air_date}</p>
			</div>
			<div class="p-4 bg-light rounded shadow">
				<h2 class="text-xl font-semibold mb-2">Rating</h2>
				<p>{tvShow.vote_average} / 10</p>
			</div>
			<div class="p-4 bg-light rounded shadow">
				<h2 class="text-xl font-semibold mb-2">Genres</h2>
				<p>{tvShow.genres.map(genre => genre.name).join(', ')}</p>
			</div>

			<div class="p-4 bg-light rounded shadow">
				<h2 class="text-xl font-semibold mb-2">Number of Seasons</h2>
				<p>{tvShow.number_of_seasons}</p>
			</div>
			<div class="p-4 bg-light rounded shadow">
				<h2 class="text-xl font-semibold mb-2">Production Companies</h2>
				<p>{tvShow.production_companies.map(company => company.name).join(', ')}</p>
			</div>
			<div class="p-4 bg-light rounded shadow">
				<h2 class="text-xl font-semibold mb-2">Spoken Languages</h2>
				<p>{tvShow.spoken_languages.map(language => language.name).join(', ')}</p>
			</div>
		</div>
	</div>
{/if}

<FooterComponent />
