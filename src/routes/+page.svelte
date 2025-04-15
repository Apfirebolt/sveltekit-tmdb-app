<script>
    import { fly } from 'svelte/transition';
    import HeaderComponent from '$lib/components/Header.svelte';
    import FooterComponent from '$lib/components/Footer.svelte';

    let text = "Welcome to TMDB Movies App";
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

<section class="relative bg-cover bg-center h-[500px]" style="background-image: url('https://atthemovies.uk/cdn/shop/products/GoodWillHunting1997us27x40in175.jpg?v=1621383309');">
    <div class="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black bg-opacity-50 flex items-center justify-center">
        <div class="text-center text-white bg-opacity-50 p-6 rounded-lg">
            <h1 class="text-4xl md:text-6xl font-bold mb-4" in:fly={{ y: 50, duration: 500 }}>
                {displayedText}
            </h1>
            <p class="text-lg md:text-xl mb-6" in:fly={{ y: 50, duration: 500, delay: 200 }}>
                Discover your favorite movies and more. This is a simple Svelte app that allows you to explore movies, shows, and people in the entertainment industry.
                Data is fetched from The Movie Database (TMDB) API.
            </p>
            <p>
                Please find the API key in the <a href="https://www.themoviedb.org/documentation/api" class="text-light hover:text-danger">TMDB API documentation</a>.
            </p>
        </div>
    </div>
</section>

<section class="py-12 bg-gray-100">
    <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-8" in:fly={{ y: 50, duration: 500 }}>
            Explore Our Features
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center p-6 bg-white shadow-lg rounded-lg" in:fly={{ y: 50, duration: 500 }}>
                <h3 class="text-xl font-semibold mb-4">Browse Movies</h3>
                <p>Find movies by genre, rating, or release date.</p>
            </div>
            <div class="text-center p-6 bg-white shadow-lg rounded-lg" in:fly={{ y: 50, duration: 500, delay: 200 }}>
                <h3 class="text-xl font-semibold mb-4">Create Watchlists</h3>
                <p>Save your favorite movies to watch later.</p>
            </div>
            <div class="text-center p-6 bg-white shadow-lg rounded-lg" in:fly={{ y: 50, duration: 500, delay: 400 }}>
                <h3 class="text-xl font-semibold mb-4">Get Recommendations</h3>
                <p>Discover movies tailored to your taste.</p>
            </div>
        </div>
    </div>
</section>

<FooterComponent />
