<script>
	import * as m from '$lib/paraglide/messages';

	let { projectId } = $props();
</script>

{#snippet title(/** @type {string} */ text)}
	<p class="project-page__title">{m.word_project()}: {text}</p>
{/snippet}

{#if projectId === 'vehicle'}
	{@render title(m.vehicle_project_title())}
{/if}

{#if projectId === 'characterization'}
	{@render title(m.characterization_project_title())}
{/if}

{#if projectId === 'endovis'}
	{@render title(m.endovis_project_title())}
{/if}

{#if projectId === 'exex'}
	{@render title(m.exex_project_title())}
{/if}
