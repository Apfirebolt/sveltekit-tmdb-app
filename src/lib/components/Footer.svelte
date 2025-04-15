<script lang="ts">
    export let year: number = new Date().getFullYear();
    let menuItems = [
		{ name: 'Home', url: '/' },
		{ name: 'About', url: '/about' },
		{ name: 'Contact', url: '/contact' },
		{ name: 'Movies', url: '/movies' }
	];
</script>

<footer class="bg-primary text-light py-6 border-t border-gray-700">
    <div class="container mx-auto text-center space-y-4">
        <nav class="flex justify-center space-x-6">
            {#each menuItems as item}
                <a href={item.url} class="text-sm hover:underline">
                    {item.name}
                </a>
            {/each}
        </nav>
        <p class="text-sm">
            &copy; {year} Sveltekit Movies. All rights reserved.
        </p>
    </div>
</footer>