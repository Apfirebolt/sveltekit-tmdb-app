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

	// Trigger animation and fetch images after the page loads
	onMount(() => {
		pageLoaded = true;
		if (person) {
			getPersonImages(person.id);
			getTaggedImages(person.id);
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

		<!-- Display person images -->
		{#if personImages.length > 0}
			<div class="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
				{#each personImages as image}
					<img
						src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
						alt=""
						class="rounded shadow"
					/>
				{/each}
			</div>
		{:else}
			<p class="mt-8 text-gray-500">No images available.</p>
		{/if}

		<!-- Display Tagged Images -->
		{#if taggedImages.length > 0}
			<div>
				<h2 class="mb-2 text-3xl font-semibold">Tagged Images</h2>
				<div class="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
					{#each taggedImages as image}
						<img
							src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
							alt=""
							class="rounded shadow"
						/>
					{/each}
				</div>
			</div>
		{:else}
			<p class="mt-8 text-gray-500">No tagged images available.</p>
		{/if}
	</div>
{/if}

<FooterComponent />
