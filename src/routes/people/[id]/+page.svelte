<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import HeaderComponent from '$lib/components/Header.svelte';
	import FooterComponent from '$lib/components/Footer.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import apiClient from '$lib/plugins/interceptor.js';
	import type { DetailedPerson, Image, ImageResponse, TaggedImageResponse, TaggedImage } from '$lib/types/People.ts'; // Import as a type

	export let data; // Receive data from the load function in +page.server.ts

	$: person = data.person as DetailedPerson | null; // Assign data.person to the person variable.

	let displayedPersonName = '';
	let personNameIndex = 0;

	let pageLoaded = false;
	let personImages: Image[] = [];
	let taggedImages: TaggedImage[] = [];
	let combinedCredits: Image[] = [];
	let selectedTab = 'images';
	let tabs = [
		{'name': 'images', 'label': 'Images', selected: true},
		{'name': 'tagged', 'label': 'Tagged Images', selected: false},
		{'name': 'combined', 'label': 'Combined Credits', selected: false}
	]

	const selectTab = (tab: string) => {
		selectedTab = tab;
	};

	const getPersonImages = async (personId: string) => {
		try {
			const response = await apiClient.get<ImageResponse>(
				`/person/${personId}/images?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			if (response.data && response.data.profiles) {
				personImages = response.data.profiles;
			} else {
				console.error('No images found for this person.');
			}
		} catch (error) {
			console.error('Error fetching person images:', error);
		}
	};

	const getTaggedImages = async (personId: string) => {
		try {
			const response = await apiClient.get<TaggedImageResponse>(
				`/person/${personId}/tagged_images?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			if (response.data && response.data.results) {
				taggedImages = response.data.results;
			} else {
				console.error('No tagged images found for this person.');
			}
		} catch (error) {
			console.error('Error fetching tagged images:', error);
		}
	};

	const getCombinedCredits = async (personId: string) => {
		try {
			const response = await apiClient.get(
				`/person/${personId}/combined_credits?api_key=${import.meta.env.VITE_APP_KEY}`
			);
			if (response.data && response.data.cast) {
				combinedCredits = response.data.cast;
			} else {
				console.error('No images found for this person.');
			}
		} catch (error) {
			console.error('Error fetching person images:', error);
		}
	};

	// Trigger animation and fetch images after the page loads
	onMount(() => {
		pageLoaded = true;
		if (person) {
			getPersonImages(person.id);
			getTaggedImages(person.id);
			getCombinedCredits(person.id);
		}
	});
</script>

<svelte:head>
	<title>{person ? person.name : 'Loading...'}</title>
	<meta name="description" content={person ? person.biography : 'Loading...'} />
</svelte:head>

<HeaderComponent title={person ? `${person.name}` : 'Person Details'} />

{#if !person}
	<Loader />
{:else}
	<section
		class="relative h-[500px] bg-center bg-no-repeat"
		style="background-image: url('https://image.tmdb.org/t/p/original{person.profile_path}');"
	>
		<div
			class="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black via-transparent to-black"
		>
			<div class="min-w-xl text-center text-white"></div>
		</div>
	</section>

	<div class="text-dark container mx-auto my-5 text-center" in:fly={{ y: 50, duration: 500 }}>
		<h1 class="mb-4 text-4xl font-bold">{person.name}</h1>
		<p class="mb-6 text-lg">{person.biography}</p>

		<div class="text-dark grid grid-cols-1 gap-4 md:grid-cols-3">
			<div class="bg-light rounded p-4 shadow">
				<h2 class="mb-2 text-xl font-semibold">Known For</h2>
				<p>{person.known_for_department}</p>
			</div>
			<div class="bg-light rounded p-4 shadow">
				<h2 class="mb-2 text-xl font-semibold">Birthday</h2>
				<p>{person.birthday}</p>
			</div>
			<div class="bg-light rounded p-4 shadow">
				<h2 class="mb-2 text-xl font-semibold">Place of Birth</h2>
				<p>{person.place_of_birth}</p>
			</div>

			<div class="bg-light rounded p-4 shadow">
				<h2 class="mb-2 text-xl font-semibold">Popularity</h2>
				<p>{person.popularity}</p>
			</div>
			<div class="bg-light rounded p-4 shadow">
				<h2 class="mb-2 text-xl font-semibold">Also Known As</h2>
				<p>{person.also_known_as.join(', ')}</p>
			</div>
		</div>

		<!-- Tabs here -->
		<div class="mt-8 p-4 shadow-xl">
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

		<!-- Display person images -->
		{#if selectedTab === 'images'}
			<h2 class="text-2xl font-bold mb-4 bg-primary text-light text-center p-2">Person Images</h2>
			<div class="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
				{#each personImages as image}
					<img
						src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
						alt=""
						class="rounded shadow"
					/>
				{/each}
			</div>
			{#if personImages.length === 0}
				<p class="mt-8 text-gray-500 text-center">No images available for this person.</p>
			{/if}
		{/if}

		<!-- Display Tagged Images -->
		{#if selectedTab === 'tagged'}
			<div>
				<h2 class="text-2xl font-bold mb-4 bg-primary text-light text-center p-2">Tagged Images</h2>
				<div class="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
					{#each taggedImages as image}
						<img
							src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
							alt=""
							class="rounded shadow"
						/>
					{/each}
				</div>
			</div>
			{#if taggedImages.length === 0}
				<p class="mt-8 text-gray-500 text-center">No tagged images available for this person.</p>
			{/if}
		{/if}

		<!-- Display Combined Credits -->
		{#if selectedTab === 'combined'}
			<div>
				<h2 class="text-2xl font-bold mb-4 bg-primary text-light text-center p-2">Combined Credits</h2>
				<div class="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
					{#each combinedCredits as credit}
						<div class="relative group">
							<img
								src={`https://image.tmdb.org/t/p/w500${credit.poster_path}`}
								alt=""
								class="rounded shadow"
							/>
							<div
								class="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							>
								<p class="text-white text-lg font-bold mb-2">{credit.original_title}</p>
								<a
									href={`/movies/${credit.id}`}
									class="text-primary bg-light px-4 py-2 rounded hover:bg-primary hover:text-light transition-colors"
								>
									View Details
								</a>
							</div>
						</div>
					{/each}
				</div>
			</div>
			{#if combinedCredits.length === 0}
				<p class="mt-8 text-gray-500 text-center">No combined credits available for this person.</p>
			{/if}
		{/if}
	</div>
{/if}

<FooterComponent />
