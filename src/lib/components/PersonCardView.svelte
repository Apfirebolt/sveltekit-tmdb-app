<script>
    import Icon from '@iconify/svelte';

    export let cast = {
        id: null,
        profile_path: '',
        name: '',
        character: ''
    };
</script>

<div class="group flex h-full flex-col overflow-hidden rounded-2xl border border-secondary/15 bg-light p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/5">
    <!-- Image / Portrait Container -->
    <div class="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-200">
        {#if cast.profile_path}
            <img
                src={`https://image.tmdb.org/t/p/w342${cast.profile_path}`}
                alt={cast.name || 'Cast member'}
                loading="lazy"
                class="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
            />
        {:else}
            <!-- Standalone SVG Fallback Avatar -->
            <div class="flex h-full w-full flex-col items-center justify-center bg-secondary/10 p-3 text-center text-secondary/50">
                <div class="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                    <Icon icon="mdi:account" class="text-3xl" />
                </div>
                <span class="text-[11px] font-medium tracking-wide">No photo available</span>
            </div>
        {/if}

        <!-- Subtle bottom shadow gradient to elevate the image frame -->
        <div class="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>

    <!-- Metadata Content -->
    <div class="mt-3 flex flex-1 flex-col justify-between text-left">
        <div>
            <h3
                class="line-clamp-1 text-sm font-bold text-dark transition-colors duration-150 group-hover:text-secondary"
                title={cast.name}
            >
                {cast.name || 'Unknown Actor'}
            </h3>

            {#if cast.character}
                <p
                    class="mt-0.5 line-clamp-2 text-xs font-medium text-dark/70"
                    title={cast.character}
                >
                    <span class="text-[11px] text-dark/45 font-normal">as</span> {cast.character}
                </p>
            {:else}
                <p class="mt-0.5 text-xs italic text-dark/40">Role unspecified</p>
            {/if}
        </div>
    </div>
</div>