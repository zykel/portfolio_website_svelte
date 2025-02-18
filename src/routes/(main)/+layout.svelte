<script>
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../../styles.css';
	import '../../mediaqueries.css';

	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<Navigation />
	{@render children()}
	<Footer />
</ParaglideJS>
