<script lang="ts">
	import '../app.css';
	import HeaderComponent from '$lib/components/Header.svelte';
	import FooterComponent from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

{@render children()}
