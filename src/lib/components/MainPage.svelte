<script>
	import * as m from '$lib/paraglide/messages.js';
	import Hero from '$lib/components/Hero.svelte';
	import SectionProjects from '$lib/components/main_page_sections/SectionProjects.svelte';
	import SectionAbout from '$lib/components/main_page_sections/SectionAbout.svelte';
	import SectionContact from '$lib/components/main_page_sections/SectionContact.svelte';
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

<Hero />
<SectionProjects />
<SectionAbout />
<SectionContact />
