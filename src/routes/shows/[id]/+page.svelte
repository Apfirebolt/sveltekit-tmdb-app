<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import apiClient from '$lib/plugins/interceptor';
	import { goto } from '$app/navigation';
	import HeaderComponent from '$lib/components/Header.svelte';
	import FooterComponent from '$lib/components/Footer.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import type { DetailedTVShow } from '$lib/types/Show.ts'; // Import as a type

	export let data; // Receive data from the load function in +page.server.ts

	$: tvShow = data.show as DetailedTVShow | null; // Assign data.tvShow to the tvShow variable.

	let displayedShowName = '';
	let showNameIndex = 0;
	let showImages = [];
	let showVideos = [];
	let showEpisodes = [];
	let showSeasons = [];
	let showCast = [];
	let showCrew = [];
	let showRecommendations = [];
	let selectedTab = 'images';

	const selectTab = (tab: string) => {
		selectedTab = tab;
	};

	let tabs = [
		{ name: 'images', label: 'Images', selected: true },
		{ name: 'videos', label: 'Videos', selected: false },
		{ name: 'episodes', label: 'Episodes', selected: false },
		{ name: 'seasons', label: 'Seasons', selected: false },
		{ name: 'cast', label: 'Cast', selected: false },
		{ name: 'crew', label: 'Crew', selected: false },
		{ name: 'recommendations', label: 'Recommendations', selected: false }
	]

	const getShowImages = async (showId: number) => {
		try {
			const response = await apiClient.get(
				`/tv/${showId}/images?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			if (response.data && response.data.backdrops) {
				showImages = response.data.backdrops;
			} else {
				console.error('No images found for this show.');
			}
		} catch (error) {
			console.error('Error fetching show images:', error);
		}
	};

	const getShowVideos = async (showId: number) => {
		try {
			const response = await apiClient.get(
				`/tv/${showId}/videos?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			if (response.data && response.data.results) {
				showVideos = response.data.results;
			} else {
				console.error('No videos found for this show.');
			}
		} catch (error) {
			console.error('Error fetching show videos:', error);
		}
	};

	const getShowEpisodes = async (showId: number) => {
		try {
			const response = await apiClient.get(
				`/tv/${showId}/season/1?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			if (response.data && response.data.episodes) {
				showEpisodes = response.data.episodes;
			} else {
				console.error('No episodes found for this show.');
			}
		} catch (error) {
			console.error('Error fetching show episodes:', error);
		}
	};

	const getShowSeasons = async (showId: number) => {
		try {
			const response = await apiClient.get(
				`/tv/${showId}/season/1?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			if (response.data && response.data.seasons) {
				showSeasons = response.data.seasons;
			} else {
				console.error('No seasons found for this show.');
			}
		} catch (error) {
			console.error('Error fetching show seasons:', error);
		}
	};

	const getShowRecommendations = async (showId: number) => {
		try {
			const response = await apiClient.get(
				`/tv/${showId}/recommendations?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			if (response.data && response.data.results) {
				showRecommendations = response.data.results;
			} else {
				console.error('No recommendations found for this show.');
			}
		} catch (error) {
			console.error('Error fetching show recommendations:', error);
		}
	};
	const getShowCrew = async (showId: number) => {
		try {
			const response = await apiClient.get(
				`/tv/${showId}/credits?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			if (response.data && response.data.crew) {
				showCrew = response.data.crew;
			} else {
				console.error('No crew found for this show.');
			}
		} catch (error) {
			console.error('Error fetching show crew:', error);
		}
	};

	const getShowCast = async (showId: number) => {
		try {
			const response = await apiClient.get(
				`/tv/${showId}/credits?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			if (response.data && response.data.cast) {
				showCast = response.data.cast;
			} else {
				console.error('No cast found for this show.');
			}
		} catch (error) {
			console.error('Error fetching show cast:', error);
		}
	};

	let pageLoaded = false;

	// Trigger animation after the page loads
	onMount(() => {
		pageLoaded = true;
		if (tvShow) {
			getShowImages(tvShow.id);
			getShowVideos(tvShow.id);
			getShowEpisodes(tvShow.id);
			getShowSeasons(tvShow.id);
			getShowRecommendations(tvShow.id);
			getShowCrew(tvShow.id);
			getShowCast(tvShow.id);
		}
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

	<!-- Tabs -->
	<div class="container mx-auto my-8">
		<div class="flex justify-center space-x-4">
			{#each tabs as tab}
			<button
			class={[
				'px-4 py-2 font-semibold border-2 border-dark rounded hover:bg-primary hover:text-light transition-colors',
				selectedTab === tab.name ? 'bg-secondary text-white' : ''
			].join(' ')}
			on:click={() => selectTab(tab.name)}
		>
			{tab.label}
		</button>
			{/each}
		</div>
	</div>

	<!-- Images Section -->
	{#if selectedTab === 'images'}
		{#if showImages.length > 0}
			<div class="container mx-auto my-8">
				<h2 class="bg-primary text-light mb-4 p-2 text-center text-2xl font-bold">Images</h2>
				<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
					{#each showImages as image}
						<img
							src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
							alt=""
							class="rounded shadow"
						/>
					{/each}
				</div>
			</div>
		{:else}
			<p class="text-center text-secondary">No images available for this show.</p>
		{/if}
	{/if}

	<!-- Videos Section -->
	{#if selectedTab === 'videos'}
		{#if showVideos.length > 0}
			<div class="container mx-auto my-8">
				<h2 class="bg-primary text-light mb-4 p-2 text-center text-2xl font-bold">Videos</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					{#each showVideos as video}
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
			<p class="text-center text-secondary">No videos available for this show.</p>
		{/if}
	{/if}
	
	<!-- Cast Section -->
	{#if selectedTab === 'cast'}
		{#if showCast.length > 0}
			<div class="container mx-auto my-8">
				<h2 class="bg-primary text-light mb-4 p-2 text-center text-2xl font-bold">Cast</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					{#each showCast as castMember}
						<div class="p-4 text-secondary text-center bg-light rounded shadow">
							{#if castMember.profile_path}
								<img
									src={`https://image.tmdb.org/t/p/w500${castMember.profile_path}`}
									alt={castMember.name}
									class="rounded mb-4"
								/>
							{:else}
								<p>Image not available</p>
							{/if}
							<h3 class="text-2xl my-3 font-semibold">{castMember.name}</h3>
							<p>{castMember.character}</p>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<p class="text-center text-secondary">No cast information available for this show.</p>
		{/if}
	{/if}
	 
	<!-- Crew Section -->
	{#if selectedTab === 'crew'}
		{#if showCrew.length > 0}
			<div class="container mx-auto my-8">
				<h2 class="bg-primary text-light mb-4 p-2 text-center text-2xl font-bold">Crew</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					{#each showCrew as crewMember}
						<div class="p-4 text-secondary text-center bg-light rounded shadow">
							{#if crewMember.profile_path}
								<img
									src={`https://image.tmdb.org/t/p/w500${crewMember.profile_path}`}
									alt={crewMember.name}
									class="rounded mb-4"
								/>
							{:else}
								<p>Image not available</p>
							{/if}
							<h3 class="text-2xl my-3 font-semibold">{crewMember.name}</h3>
							<p>{crewMember.job}</p>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<p class="text-center text-secondary">No crew information available for this show.</p>
		{/if}
	{/if}

	<!-- Seasons -->
	{#if selectedTab === 'seasons'}
		{#if showSeasons.length > 0}
			<div class="container mx-auto my-8">
				<h2 class="bg-primary text-light mb-4 p-2 text-center text-2xl font-bold">Seasons</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					{#each showSeasons as season}
						<div class="p-4 bg-light rounded shadow">
							<img
								src={`https://image.tmdb.org/t/p/w500${season.poster_path}`}
								alt={season.name}
								class="rounded mb-4"
							/>
							<h3 class="text-2xl text-center my-3 font-semibold">{season.name}</h3>
							<p>Air Date: {season.air_date}</p>
							<p>Episodes: {season.episode_count}</p>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<p class="text-center text-secondary">No seasons information available for this show.</p>
		{/if}
	{/if}

	<!-- Episodes -->
	{#if selectedTab === 'episodes'}
		{#if showEpisodes.length > 0}
			<div class="container mx-auto my-8">
				<h2 class="bg-primary text-light mb-4 p-2 text-center text-2xl font-bold">Episodes</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					{#each showEpisodes as episode}
						<div class="p-4 bg-light rounded shadow">
							{#if episode.still_path}
								<img
									src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
									alt={episode.name}
									class="rounded mb-4"
								/>
							{:else}
								<p class="text-center text-lg my-2">Image not available</p>
							{/if}
							<h3 class="text-2xl text-center my-3 font-semibold">{episode.name}</h3>
							<p>Air Date: {episode.air_date}</p>
							<p>{episode.overview}</p>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<p class="text-center text-secondary">No episodes information available for this show.</p>
		{/if}
	{/if}

	<!-- Recommendations -->
	{#if selectedTab === 'recommendations'}
		{#if showRecommendations.length > 0}
			<div class="container mx-auto my-8">
				<h2 class="bg-primary text-light mb-4 p-2 text-center text-2xl font-bold">Recommendations</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					{#each showRecommendations as recommendation}
						<div class="p-4 bg-light rounded shadow">
							<img
								src={`https://image.tmdb.org/t/p/w500${recommendation.poster_path}`}
								alt={recommendation.name}
								class="rounded mb-4"
							/>
							<h3 class="text-2xl text-center my-3 font-semibold">{recommendation.name}</h3>
							<p>{recommendation.overview}</p>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<p class="text-center text-secondary">No recommendations available for this show.</p>
		{/if}
	{/if}
{/if}

<FooterComponent />
