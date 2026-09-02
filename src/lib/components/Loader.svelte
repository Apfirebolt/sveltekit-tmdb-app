<script lang="ts">
    import { fade } from 'svelte/transition';

    export let message: string = 'Loading...';
    export let showText: boolean = true;
</script>

<div
    class="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4"
    transition:fade={{ duration: 200 }}
    role="status"
    aria-live="polite"
    aria-label={message}
>
    <!-- Multi-Color Gradient Mesh Backdrop with Frost Blur -->
    <div class="animated-bg absolute inset-0 opacity-80 backdrop-blur-md"></div>
    <div class="absolute inset-0 bg-dark/25"></div>

    <!-- Centered Glass Card -->
    <div class="relative z-10 flex flex-col items-center rounded-3xl border border-white/25 bg-white/20 px-8 py-7 shadow-2xl backdrop-blur-xl transition-all">
        
        <!-- Dual-Track Cinema Spinner -->
        <div class="relative flex h-16 w-16 items-center justify-center">
            <!-- Muted Track Ring -->
            <div class="absolute inset-0 rounded-full border-4 border-white/20"></div>

            <!-- Fast Outer Orbit -->
            <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-secondary animate-spin"></div>

            <!-- Reverse Inner Glow Ring -->
            <div class="h-9 w-9 rounded-full border-2 border-transparent border-b-light border-l-white/60 animate-reverse-spin"></div>

            <!-- Center Pulsing Core -->
            <div class="h-2.5 w-2.5 rounded-full bg-light shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse"></div>
        </div>

        {#if showText}
            <!-- Label with Breathing Animation -->
            <div class="mt-4 flex items-center gap-1.5 text-center">
                <span class="text-xs font-bold tracking-widest uppercase text-light drop-shadow-sm">
                    {message}
                </span>
                <span class="inline-flex space-x-0.5">
                    <span class="h-1 w-1 rounded-full bg-light animate-bounce [animation-delay:-0.3s]"></span>
                    <span class="h-1 w-1 rounded-full bg-light animate-bounce [animation-delay:-0.15s]"></span>
                    <span class="h-1 w-1 rounded-full bg-light animate-bounce"></span>
                </span>
            </div>
        {/if}
    </div>
</div>

<style>
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    @keyframes reverseSpin {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
    }

    .animated-bg {
        background: linear-gradient(135deg, #78dcca, #B1F0F7, #ff6a5e, #ff7eb3);
        background-size: 300% 300%;
        animation: gradientShift 8s ease infinite;
    }

    .animate-reverse-spin {
        animation: reverseSpin 1.4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
    }
</style>