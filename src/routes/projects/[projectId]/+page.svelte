<script>
	import * as m from '$lib/paraglide/messages.js';
	import { range } from 'd3';
	import { subpageContents } from '$lib/assets/subpage_contents.js';
	let { data } = $props();

	const projectId = /** @type {string} */ (data.projectId);
	const content = subpageContents[projectId];
</script>

{#each content.paragraphs as paragraph}
	<p class="project-page__paragraph">
		{paragraph}
	</p>
{/each}
