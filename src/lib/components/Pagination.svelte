<script>
    import Icon from '@iconify/svelte';

    export let currentPage = 1;
    export let totalPages = 1;
    export let totalResults = 0;
    export let goToPreviousPage = () => {};
    export let goToNextPage = () => {};
</script>

<nav
    aria-label="Pagination Navigation"
    class="flex flex-col items-center justify-between gap-4 rounded-2xl border border-secondary/15 bg-light/80 px-4 py-3 shadow-sm backdrop-blur-sm sm:flex-row sm:px-6"
>
    <!-- Pagination Meta Counter -->
    <div class="flex items-center gap-2 text-xs font-medium text-dark/70 sm:text-sm">
        <span class="inline-flex items-center gap-1.5 font-semibold text-dark">
            <Icon icon="mdi:file-document-outline" class="text-base text-secondary" />
            Page <span class="rounded bg-secondary/10 px-2 py-0.5 font-bold text-secondary">{currentPage}</span> of {totalPages}
        </span>
        {#if totalResults > 0}
            <span class="text-dark/30">•</span>
            <span class="text-dark/60">
                {Number(totalResults).toLocaleString()} results
            </span>
        {/if}
    </div>

    <!-- Directional Buttons -->
    <div class="flex items-center gap-2">
        <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl border border-secondary/20 bg-light px-3.5 py-2 text-xs font-semibold text-dark shadow-sm transition-all duration-150 hover:bg-secondary/10 hover:text-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
            on:click={goToPreviousPage}
            disabled={currentPage <= 1}
            aria-label="Go to previous page"
        >
            <Icon icon="mdi:chevron-left" class="text-base" />
            <span>Previous</span>
        </button>

        <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl bg-secondary px-4 py-2 text-xs font-semibold text-light shadow-md transition-all duration-150 hover:bg-danger focus:outline-none focus:ring-2 focus:ring-secondary/50 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
            on:click={goToNextPage}
            disabled={currentPage >= totalPages}
            aria-label="Go to next page"
        >
            <span>Next</span>
            <Icon icon="mdi:chevron-right" class="text-base" />
        </button>
    </div>
</nav>