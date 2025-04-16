<script>
    import Icon from '@iconify/svelte';
    
    export let currentPage = 1;
    export let totalPages = 1;
    export let totalResults = 0;
    export let goToPreviousPage;
    export let goToNextPage;
</script>

<div class="mt-4 mb-3 flex items-center justify-center">
    <p class="text-dark mx-2 mb-2 text-lg">
        Page {currentPage} of {totalPages} | Total Results: {totalResults}
    </p>
    <div class="flex justify-center">
        <button
            class="bg-secondary hover:bg-secondary flex items-center rounded px-4 py-2 text-white disabled:opacity-50"
            on:click={goToPreviousPage}
            disabled={currentPage === 1}
        >
            <Icon icon="mdi:arrow-left" class="mr-2" />
            Previous
        </button>
        <button
            class="bg-secondary hover:bg-secondary mx-2 flex items-center rounded px-4 py-2 text-white disabled:opacity-50"
            on:click={goToNextPage}
            disabled={currentPage === totalPages}
        >
            Next
            <Icon icon="mdi:arrow-right" class="ml-2" />
        </button>
    </div>
</div>