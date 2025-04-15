<script lang="ts">
	export let year: number = new Date().getFullYear();
	let menuItems = [
		{ name: 'Home', url: '/' },
		{ name: 'About', url: '/about' },
		{ name: 'Movies', url: '/movies' }
	];
</script>

<footer class="bg-light text-dark border-secondary border-t py-6">
	<div class="container mx-auto space-y-4 text-center">
		<nav class="flex justify-center space-x-6">
			{#each menuItems as item}
				<a href={item.url} class="hover:underline">
					{item.name}
				</a>
			{/each}
		</nav>
		<div class="grid grid-cols-4 space-x-4 md:my-12">
			<div>
				<h3 class="text-2xl font-bold">Get Info</h3>
				<p class="my-3">
					Learn more about movies, shows, and people in the entertainment industry.
				</p>
			</div>
			<div>
				<h3 class="text-2xl font-bold">Trending</h3>
				<p class="my-3">Stay updated with the latest trending movies, shows, and celebrities.</p>
			</div>
			<div>
				<h3 class="text-2xl font-bold">Discover</h3>
				<p class="my-3">Explore new and exciting movies, shows, and people to follow.</p>
			</div>
			<div>
				<h3 class="text-2xl font-bold">More</h3>
				<p class="my-3">Find out more about us, get in touch, or check out our FAQ section.</p>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="subscribe-form">
				<h3 class="text-2xl font-bold">Subscribe to our Newsletter</h3>
				<p class="my-3">Get the latest updates and news delivered to your inbox.</p>
			</div>
			<div>
				<p>
					&copy; {year} Sveltekit Movies. All rights reserved.
				</p>
                <form
					on:submit|preventDefault={() => alert('Subscribed!')}
					class="my-3"
				>
					<input
						type="email"
						placeholder="Enter your email"
						class="w-full rounded border border-gray-300 px-4 py-2 md:w-auto"
						required
					/>
					<button type="submit" class="bg-secondary text-light rounded px-6 py-2 hover:bg-danger">
						Subscribe
					</button>
				</form>
			</div>
		</div>
	</div>
</footer>
