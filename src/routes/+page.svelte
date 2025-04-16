<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import HeaderComponent from '$lib/components/Header.svelte';
	import FooterComponent from '$lib/components/Footer.svelte';
	import { trendingStore } from '$lib/stores/trending';
	import type { Movie } from '$lib/types/Movie';

	$: ({ loading, movies } = $trendingStore);

	let text = 'Welcome to TMDB Movies App';
	let displayedText = '';
	let index = 0;
	let currentPage = 1;

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

	const goToMovieDetails = (movie: Movie) => {
		goto(`/movies/${movie.id}`);
	};

	onMount(() => {
		trendingStore.getTrendingMovies('day', currentPage); // Replace 'day' and 'movie' with appropriate arguments
	});
</script>

<HeaderComponent />

<section
	class="relative h-[500px] bg-cover bg-center"
	style="background-image: url('https://atthemovies.uk/cdn/shop/products/GoodWillHunting1997us27x40in175.jpg?v=1621383309');"
>
	<div
		class="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black via-transparent to-black"
	>
		<div class="bg-opacity-50 rounded-lg p-6 text-center text-white">
			<h1 class="mb-4 text-4xl font-bold md:text-6xl" in:fly={{ y: 50, duration: 500 }}>
				{displayedText}
			</h1>
			<p class="mb-6 text-lg md:text-xl" in:fly={{ y: 50, duration: 500, delay: 200 }}>
				Discover your favorite movies and more. This is a simple Svelte app that allows you to
				explore movies, shows, and people in the entertainment industry. Data is fetched from The
				Movie Database (TMDB) API.
			</p>
			<p>
				Please find the API key in the <a
					href="https://www.themoviedb.org/documentation/api"
					class="text-light hover:text-danger">TMDB API documentation</a
				>.
			</p>
		</div>
	</div>
</section>

<section class="bg-gray-100 py-12">
	<div class="container mx-auto px-6">
		<h2 class="mb-8 text-center text-3xl font-bold" in:fly={{ y: 50, duration: 500 }}>
			Explore Our Features
		</h2>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<div class="rounded-lg bg-white p-6 text-center shadow-lg" in:fly={{ y: 50, duration: 500 }}>
				<h3 class="mb-4 text-xl font-semibold">Browse Movies</h3>
				<p>Find movies by genre, rating, or release date.</p>
			</div>
			<div
				class="rounded-lg bg-white p-6 text-center shadow-lg"
				in:fly={{ y: 50, duration: 500, delay: 200 }}
			>
				<h3 class="mb-4 text-xl font-semibold">Create Watchlists</h3>
				<p>Save your favorite movies to watch later.</p>
			</div>
			<div
				class="rounded-lg bg-white p-6 text-center shadow-lg"
				in:fly={{ y: 50, duration: 500, delay: 400 }}
			>
				<h3 class="mb-4 text-xl font-semibold">Get Recommendations</h3>
				<p>Discover movies tailored to your taste.</p>
			</div>
		</div>
	</div>
</section>

<!-- Trending Movie section -->
<section>
	<div class="container mx-auto pb-4">
		<h2
			class="bg-primary text-light mb-4 p-2 text-center text-2xl font-bold"
			in:fly={{ y: 50, duration: 500 }}
		>
			Trending Movies
		</h2>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			{#each movies as movie}
				<div class="rounded-lg bg-white p-4 shadow-lg" in:fly={{ y: 50, duration: 500 }}>
					<img
						src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
						alt={movie.title}
						class="mb-4 rounded-lg"
					/>
					<h3 class="my-2 text-2xl font-semibold">{movie.title}</h3>
					<p class="my-2">{movie.release_date}</p>
					<p class="text-gray-600">{movie.overview}</p>
					<button
						class="bg-primary hover:bg-danger text-light mt-4 inline-block rounded-md px-2 py-1 shadow-lg"
						on:click={() => goToMovieDetails(movie)}
					>
						View Details
					</button>
				</div>
			{/each}
		</div>
	</div>
</section>

<FooterComponent />
