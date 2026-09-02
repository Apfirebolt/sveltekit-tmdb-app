<script>
    import Icon from '@iconify/svelte';
</script>

<section class="relative flex min-h-[80vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8 bg-light text-dark overflow-hidden">
    <!-- Ambient Backdrop Gradient & Grid Glow -->
    <div class="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-30">
        <div class="h-[450px] w-[450px] rounded-full bg-secondary/20 blur-3xl filter"></div>
        <div class="h-[350px] w-[350px] rounded-full bg-danger/10 blur-3xl filter"></div>
    </div>

    <div class="container mx-auto max-w-2xl text-center">
        <!-- Floating Glass Card -->
        <div class="relative rounded-3xl border border-secondary/15 bg-light/70 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
            
            <!-- Cinema 404 Accent Badge -->
            <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary/10 text-secondary ring-1 ring-secondary/20">
                <Icon icon="mdi:filmstrip-off" class="h-10 w-10 text-secondary" />
            </div>

            <!-- Big Impact Number -->
            <div class="relative mb-4 inline-block">
                <h1 class="text-7xl font-black tracking-tighter text-dark sm:text-8xl md:text-9xl">
                    4<span class="text-secondary">0</span>4
                </h1>
                <span class="sr-only">Error 404 - Page Not Found</span>
            </div>

            <!-- Copy -->
            <h2 class="text-xl font-extrabold tracking-tight text-dark sm:text-2xl md:text-3xl">
                Scene Not Found
            </h2>
            <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-dark/70 sm:text-base">
                Looks like this reel was cut from the final edit. Don't worry, you can explore thousands of other movies and shows on our homepage.
            </p>

            <!-- Actions -->
            <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                    href="/"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-light shadow-md transition-all duration-150 hover:bg-danger focus:outline-none focus:ring-2 focus:ring-secondary/50 active:scale-95 sm:w-auto"
                >
                    <Icon icon="mdi:home-outline" class="text-base" />
                    <span>Back to Homepage</span>
                </a>
                
                <button
                    type="button"
                    on:click={() => history.back()}
                    class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-secondary/20 bg-transparent px-5 py-3 text-sm font-semibold text-dark transition-all duration-150 hover:bg-secondary/10 hover:text-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40 active:scale-95 sm:w-auto"
                >
                    <Icon icon="mdi:arrow-left" class="text-base" />
                    <span>Previous Page</span>
                </button>
            </div>
        </div>
    </div>
</section>