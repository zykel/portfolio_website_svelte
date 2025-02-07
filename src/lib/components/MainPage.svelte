<script>
	import * as m from '$lib/paraglide/messages.js';
	import Navigation from '$lib/components/Navigation.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import SectionProjects from '$lib/components/main_page_sections/SectionProjects.svelte';
	import SectionAbout from '$lib/components/main_page_sections/SectionAbout.svelte';
	import SectionContact from '$lib/components/main_page_sections/SectionContact.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import {
		createIntersectionHandlerForSectionTitles,
		setupPage
	} from '$lib/scripts/utilityMainPage.js';

	import { onMount } from 'svelte';

	onMount(() => {
		createIntersectionHandlerForSectionTitles();
	});
</script>

<svelte:window onload={setupPage} />

<Navigation />
<Hero />
<SectionProjects />
<SectionAbout />
<SectionContact />
<Footer />
