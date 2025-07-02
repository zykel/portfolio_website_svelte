<script>
	import * as m from '$lib/paraglide/messages';

	let { projectId } = $props();
</script>

{#snippet p(/** @type {string} */ text)}
	<p class="project-page__paragraph">
		{@html text}
	</p>
{/snippet}

{#if projectId === 'vehicle'}
	{@render p(m.vehicle_description_paragraph_1())}
	{@render p(m.vehicle_description_paragraph_2())}
	{@render p(m.vehicle_description_paragraph_3())}
	{@render p(m.vehicle_description_paragraph_4())}
{/if}

{#if projectId === 'methane'}
	{@render p(m.methane_description_paragraph_1())}
	{@render p(m.methane_description_paragraph_2())}
{/if}

{#if projectId === 'characterization'}
	{@render p(m.characterization_description_paragraph_1())}
	{@render p(m.characterization_description_paragraph_2())}
	{@render p(m.characterization_description_paragraph_3())}
{/if}

{#if projectId === 'endovis'}
	{@render p(m.endovis_description_paragraph_1())}
	{@render p(m.endovis_description_paragraph_2())}
	{@render p(m.endovis_description_paragraph_3())}
{/if}

{#if projectId === 'climate_flows'}
	{@render p(m.climate_flows_description_paragraph_1())}
	{@render p(m.climate_flows_description_paragraph_2())}
	{@render p(m.climate_flows_description_paragraph_3())}
{/if}

{#if projectId === 'exex'}
	{@render p(m.exex_description_paragraph_1())}
	{@render p(m.exex_description_paragraph_2())}
	{@render p(m.exex_description_paragraph_3())}
	{@render p(m.exex_description_paragraph_4())}
{/if}
