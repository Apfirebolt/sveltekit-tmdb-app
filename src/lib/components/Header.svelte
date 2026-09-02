<script>
    import Icon from '@iconify/svelte';

    export let title = 'Svelte Kit Movies';

    let menuItems = [
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' },
        { name: 'Movies', url: '/movies' },
        { name: 'Person', url: '/people' },
        { name: 'TV Shows', url: '/shows' },
        { name: 'Collection', url: '/collection' },
        { name: 'Discover', url: '/discover' }
    ];

    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function closeMenu() {
        isMenuOpen = false;
    }
</script>

<!-- Backdrop Blur / Overlay for Mobile Drawer -->
{#if isMenuOpen}
    <div
        class="fixed inset-0 z-40 bg-dark/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
        on:click={closeMenu}
        aria-hidden="true"
    ></div>
{/if}

<header class="fixed top-0 left-0 z-50 w-full border-b border-secondary/15 bg-light/95 backdrop-blur-md transition-all duration-200">
    <div class="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <!-- Brand / Title -->
        <a href="/" class="group flex items-center gap-2 tracking-tight">
            <span class="text-2xl font-extrabold text-dark transition-colors duration-200 group-hover:text-secondary sm:text-3xl">
                {title}
            </span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex lg:items-center lg:gap-1">
            {#each menuItems as item}
                <a
                    href={item.url}
                    data-sveltekit-prefetch
                    class="rounded-lg px-3.5 py-2 text-sm font-semibold text-secondary transition-all duration-150 hover:bg-dark hover:text-light focus:outline-none focus:ring-2 focus:ring-secondary/40 active:scale-95"
                >
                    {item.name}
                </a>
            {/each}
        </nav>

        <!-- Mobile Menu Toggle Button -->
        <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg p-2.5 text-dark transition-colors hover:bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-secondary/40 lg:hidden"
            on:click={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Toggle main menu"
        >
            <Icon icon="mdi:menu" class="h-7 w-7" />
        </button>
    </div>

    <!-- Mobile Drawer -->
    <div
        class="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-secondary text-light shadow-2xl transition-transform duration-300 ease-in-out lg:hidden"
        class:translate-x-0={isMenuOpen}
        class:translate-x-full={!isMenuOpen}
        role="dialog"
        aria-modal="true"
    >
        <!-- Drawer Header -->
        <div class="flex h-20 items-center justify-between border-b border-light/10 px-6">
            <span class="text-lg font-bold tracking-wide text-light/90">Navigation</span>
            <button
                type="button"
                class="rounded-lg p-2 text-light/80 transition-colors hover:bg-light/10 hover:text-light focus:outline-none focus:ring-2 focus:ring-light/50"
                on:click={closeMenu}
                aria-label="Close menu"
            >
                <Icon icon="mdi:close" class="h-6 w-6" />
            </button>
        </div>

        <!-- Drawer Links -->
        <nav class="flex-1 overflow-y-auto px-4 py-6">
            <ul class="space-y-2">
                {#each menuItems as item}
                    <li>
                        <a
                            href={item.url}
                            data-sveltekit-prefetch
                            on:click={closeMenu}
                            class="flex w-full items-center rounded-lg bg-bermuda px-4 py-3 text-sm font-semibold tracking-wide text-white shadow-sm transition-all duration-200 hover:bg-danger hover:shadow active:scale-[0.98]"
                        >
                            {item.name}
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
    </div>
</header>