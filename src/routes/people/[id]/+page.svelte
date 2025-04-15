<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import HeaderComponent from '$lib/components/Header.svelte';
	import FooterComponent from '$lib/components/Footer.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import type { DetailedPerson } from '$lib/types/People.ts'; // Import as a type

	export let data; // Receive data from the load function in +page.server.ts

	$: person = data.person as DetailedPerson | null; // Assign data.person to the person variable.

	let displayedPersonName = '';
	let personNameIndex = 0;

	let pageLoaded = false;

	// Trigger animation after the page loads
	onMount(() => {
		pageLoaded = true;
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
			<div class="min-w-xl text-center text-white">
			</div>
		</div>
	</section>

	<div
		class="container mx-auto text-center text-dark my-5"
		in:fly={{ y: 50, duration: 500 }}
	>
		<h1 class="text-4xl font-bold mb-4">{person.name}</h1>
		<p class="text-lg mb-6">{person.biography}</p>

		<div class="grid grid-cols-1 text-dark md:grid-cols-3 gap-4">
			<div class="p-4 bg-light rounded shadow">
				<h2 class="text-xl font-semibold mb-2">Known For</h2>
				<p>{person.known_for_department}</p>
			</div>
			<div class="p-4 bg-light rounded shadow">
				<h2 class="text-xl font-semibold mb-2">Birthday</h2>
				<p>{person.birthday}</p>
			</div>
			<div class="p-4 bg-light rounded shadow">
				<h2 class="text-xl font-semibold mb-2">Place of Birth</h2>
				<p>{person.place_of_birth}</p>
			</div>

			<div class="p-4 bg-light rounded shadow">
				<h2 class="text-xl font-semibold mb-2">Popularity</h2>
				<p>{person.popularity}</p>
			</div>
			<div class="p-4 bg-light rounded shadow">
				<h2 class="text-xl font-semibold mb-2">Also Known As</h2>
				<p>{person.also_known_as.join(', ')}</p>
			</div>
		</div>
	</div>
{/if}

<FooterComponent />
