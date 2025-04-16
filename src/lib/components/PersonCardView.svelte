<div class="p-4 bg-light rounded shadow">
    <img
        src={cast.profile_path ? `https://image.tmdb.org/t/p/original${cast.profile_path}` : 'https://cdn.vectorstock.com/i/500p/32/45/no-image-symbol-missing-available-icon-gallery-vector-45703245.jpg'}
        alt={cast.name}
        class="rounded shadow mb-2"
    />
    <h3 class="text-lg font-semibold">{cast.name}</h3>
    <p>{cast.character}</p>
</div>

<script>
    export let cast = {
        profile_path: '',
        name: '',
        character: ''
    };
</script>