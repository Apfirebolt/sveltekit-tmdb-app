<script>
    import { fly } from 'svelte/transition';
    import HeaderComponent from '$lib/components/Header.svelte';
    import FooterComponent from '$lib/components/Footer.svelte';

    let text = "Welcome to Svelte Movies";
    let displayedText = "";
    let index = 0;

    // Typewriter effect logic
    const typeWriter = () => {
        if (index < text.length) {
            displayedText += text[index];
            index++;
            setTimeout(typeWriter, 100); // Adjust speed here
        }
    };

    // Start the typewriter effect when the component is mounted
    typeWriter();
</script>

<HeaderComponent />

<section class="relative bg-cover bg-center h-[500px]" style="background-image: url('https://plus.unsplash.com/premium_photo-1710409625244-e9ed7e98f67b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');">
    <div class="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black bg-opacity-50 flex items-center justify-center">
        <div class="text-center text-white">
            <h1 class="text-4xl md:text-6xl font-bold mb-4" in:fly="{{ x: -200, duration: 500 }}">
                {displayedText}
            </h1>
            <p class="text-lg md:text-xl mb-6" in:fly="{{ x: -200, duration: 500, delay: 200 }}">
                Discover your favorite movies and more
            </p>
            <button class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg" in:fly="{{ x: -200, duration: 500, delay: 400 }}">
                Get Started
            </button>
        </div>
    </div>
</section>

<FooterComponent />
