<script lang="ts">
    export let year: number = new Date().getFullYear();
    let menuItems = [
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' },
        { name: 'Movies', url: '/movies' },
        { name: 'Person', url: '/people' },
        { name: 'TV Shows', url: '/shows' },
        { name: 'Collection', url: '/collection' },
        { name: 'Discover', url: '/discover' }
    ];
</script>

<footer class="border-t border-secondary/20 bg-light text-dark">
    <div class="container mx-auto px-4 py-12 md:py-16">
        <div class="mb-12 grid grid-cols-1 items-center gap-8 border-b border-secondary/15 pb-12 lg:grid-cols-12">
            <div class="lg:col-span-5">
                <h3 class="text-xl font-bold tracking-tight text-dark sm:text-2xl">
                    Subscribe to our Newsletter
                </h3>
                <p class="mt-2 text-sm text-dark/70 sm:text-base">
                    Get the latest movie reviews, trending shows, and celebrity updates straight to your inbox.
                </p>
            </div>
            <div class="lg:col-span-7">
                <form 
                    on:submit|preventDefault={() => alert('Subscribed!')} 
                    class="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end"
                >
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        class="w-full rounded-lg border border-secondary/30 bg-transparent px-4 py-2.5 text-sm transition-colors focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary sm:max-w-xs"
                        required
                    />
                    <button 
                        type="submit" 
                        class="inline-flex shrink-0 items-center justify-center rounded-lg bg-secondary px-6 py-2.5 text-sm font-medium text-light transition-all duration-150 hover:bg-danger focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:ring-offset-2 active:scale-95"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </div>

        <nav aria-label="Footer Navigation" class="mb-12 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {#each menuItems as item}
                <a 
                    href={item.url} 
                    class="text-sm font-medium text-dark/80 transition-colors duration-150 hover:text-dark hover:underline underline-offset-4"
                >
                    {item.name}
                </a>
            {/each}
        </nav>

        <div class="grid grid-cols-1 gap-8 text-left sm:grid-cols-2 lg:grid-cols-4">
            <div class="space-y-2">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-dark/50">Get Info</h4>
                <p class="text-sm leading-relaxed text-dark/75">
                    Learn more about movies, shows, and people in the entertainment industry.
                </p>
            </div>
            <div class="space-y-2">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-dark/50">Trending</h4>
                <p class="text-sm leading-relaxed text-dark/75">
                    Stay updated with the latest trending movies, shows, and celebrities.
                </p>
            </div>
            <div class="space-y-2">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-dark/50">Discover</h4>
                <p class="text-sm leading-relaxed text-dark/75">
                    Explore new and exciting movies, shows, and people to follow.
                </p>
            </div>
            <div class="space-y-2">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-dark/50">More</h4>
                <p class="text-sm leading-relaxed text-dark/75">
                    Find out more about us, get in touch, or check out our FAQ section.
                </p>
            </div>
        </div>

        <div class="mt-12 border-t border-secondary/15 pt-8 text-center text-xs text-dark/60">
            <p>&copy; {year} Sveltekit Movies. All rights reserved.</p>
        </div>
    </div>
</footer>