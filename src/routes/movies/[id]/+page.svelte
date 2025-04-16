<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import apiClient from '$lib/plugins/interceptor';
	import HeaderComponent from '$lib/components/Header.svelte';
	import FooterComponent from '$lib/components/Footer.svelte';
	import PersonCardView from '$lib/components/PersonCardView.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import type { DetailedMovie } from '$lib/types/Movie.ts'; // Import as a type

	export let data; // Receive data from the load function in +page.server.ts

	$: movie = data.movie as DetailedMovie | null; // Assign data.movie to the movie variable.

	let displayedMovieName = '';
	let movieNameIndex = 0;
	let movieImages: any[] = [];
	let movieVideos: any[] = [];
	let movieRecommendations: any[] = [];
	let movieReviews: any[] = [];
	let movieCast: any[] = [];
	let movieCrew: any[] = [];

	let pageLoaded = false;

	const getMovieImages = async (movieId: string) => {
		try {
			const response = await apiClient.get(
				`/movie/${movieId}/images?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			if (response.data && response.data.backdrops) {
				movieImages = response.data.backdrops;
			} else {
				console.error('No images found for this movie.');
			}
		} catch (error) {
			console.error('Error fetching movie images:', error);
		}
	};

	const getMovieVideos = async (movieId: string) => {
		try {
			const response = await apiClient.get(
				`/movie/${movieId}/videos?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			if (response.data && response.data.results) {
				movieVideos = response.data.results;
			} else {
				console.error('No videos found for this movie.');
			}
		} catch (error) {
			console.error('Error fetching movie videos:', error);
		}
	};

	const getMovieRecommendations = async (movieId: string) => {
		try {
			const response = await apiClient.get(
				`/movie/${movieId}/recommendations?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			if (response.data && response.data.results) {
				movieRecommendations = response.data.results;
			} else {
				console.error('No recommendations found for this movie.');
			}
		} catch (error) {
			console.error('Error fetching movie recommendations:', error);
		}
	};

	const getMovieReviews = async (movieId: string) => {
		try {
			const response = await apiClient.get(
				`/movie/${movieId}/reviews?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			if (response.data && response.data.results) {
				movieReviews = response.data.results;
			} else {
				console.error('No reviews found for this movie.');
			}
		} catch (error) {
			console.error('Error fetching movie reviews:', error);
		}
	};

	const getMovieCast = async (movieId: string) => {
		try {
			const response = await apiClient.get(
				`/movie/${movieId}/credits?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			if (response.data && response.data.cast) {
				movieCast = response.data.cast;
			} else {
				console.error('No cast found for this movie.');
			}
		} catch (error) {
			console.error('Error fetching movie cast:', error);
		}
	};

	const getMovieCrew = async (movieId: string) => {
		try {
			const response = await apiClient.get(
				`/movie/${movieId}/credits?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			if (response.data && response.data.crew) {
				movieCrew = response.data.crew;
			} else {
				console.error('No crew found for this movie.');
			}
		} catch (error) {
			console.error('Error fetching movie crew:', error);
		}
	};

	// Function to display movie name with animation
	const displayMovieName = () => {
		if (movie && movie.title) {
			displayedMovieName = movie.title[movieNameIndex];
			movieNameIndex = (movieNameIndex + 1) % movie.title.length;
		}
	};

	// Trigger animation after the page loads
	onMount(() => {
		pageLoaded = true;
		if (movie) {
			getMovieImages(movie.id);
			getMovieVideos(movie.id);
			getMovieRecommendations(movie.id);
			getMovieReviews(movie.id);
			getMovieCast(movie.id);
			getMovieCrew(movie.id);
		}
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

	<!-- Container for movie images -->
	{#if movieImages.length > 0}
		<div class="container mx-auto my-5">
			<h2 class="text-2xl font-bold mb-4 bg-primary text-light text-center p-2">Movie Images</h2>
			<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
				{#each movieImages as image}
					<img
						src={`https://image.tmdb.org/t/p/original${image.file_path}`}
						alt={`Image from the movie ${movie.title}`}
						class="rounded shadow"
					/>
				{/each}
			</div>
		</div>
	{:else}
		<p class="text-center my-3">No images available for this movie.</p>
	{/if}

	<!-- Container for movie videos -->
	{#if movieVideos.length > 0}
		<div class="container mx-auto my-5">
			<h2 class="text-2xl font-bold mb-4 bg-primary text-light text-center p-2">Movie Videos</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				{#each movieVideos as video}
					<iframe
						width="100%"
						height="315"
						src={`https://www.youtube.com/embed/${video.key}`}
						title={video.name}
						frameborder="0"
						allowfullscreen
					></iframe>
				{/each}
			</div>
		</div>
	{:else}
		<p class="text-center my-3">No videos available for this movie.</p>
	{/if}

	<!-- Movie Cast -->
	{#if movieCast.length > 0}
		<div class="container mx-auto my-5">
			<h2 class="text-2xl font-bold mb-4 bg-primary text-light text-center p-2">Movie Cast</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				{#each movieCast as cast}
					<PersonCardView
						cast={cast}
					/>
				{/each}
			</div>
		</div>
	{:else}
		<p class="text-center my-3">No cast information available for this movie.</p>
	{/if}

	<!-- Movie Crew -->
	{#if movieCrew.length > 0}
		<div class="container mx-auto my-5">
			<h2 class="text-2xl font-bold mb-4 bg-primary text-light text-center p-2">Movie Crew</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				{#each movieCrew as crew}
					<div class="p-4 bg-light rounded shadow">
						{#if crew.profile_path}
							<img
								src={`https://image.tmdb.org/t/p/original${crew.profile_path}`}
								alt={crew.name}
								class="rounded shadow mb-2"
							/>
						{:else}
							<p class="text-center my-3 text-secondary">Image not available</p>
						{/if}
						<h3 class="text-lg font-semibold">{crew.name}</h3>
						<p>{crew.job}</p>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<p class="text-center my-3">No crew information available for this movie.</p>
	{/if}

	<!-- Movie Reviews -->
	{#if movieReviews.length > 0}
		<div class="container mx-auto my-5">
			<h2 class="text-2xl font-bold mb-4 bg-primary text-light text-center p-2">Movie Reviews</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				{#each movieReviews as review}
					<div class="p-4 bg-light rounded shadow">
						<h3 class="text-lg font-semibold my-3 text-center">{review.author}</h3>
						<p>{review.content}</p>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<p class="text-center my-3">No reviews available for this movie.</p>
	{/if}

	<!-- Movie Recommendations -->
	{#if movieRecommendations.length > 0}
		<div class="container mx-auto my-5">
			<h2 class="text-2xl font-bold mb-4 bg-primary text-light text-center p-2">Movie Recommendations</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				{#each movieRecommendations as recommendation}
					<div class="p-4 bg-light rounded shadow">
						<img
							src={`https://image.tmdb.org/t/p/original${recommendation.poster_path}`}
							alt={recommendation.title}
							class="rounded shadow mb-2"
						/>
						<h3 class="text-xl font-semibold text-secondary mt-2 text-center">{recommendation.title}</h3>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<p class="text-center my-3">No recommendations available for this movie.</p>
	{/if}

{/if}		


<FooterComponent />
