<script>
	import * as m from '$lib/paraglide/messages';
	import infos from '$lib/assets/nonMultilingualSubpageInfos.json';
	import { infosUnilingual } from '$lib/assets/nonMultilingualSubpageInfos.js';

	let { projectId } = $props();
</script>

{#snippet details(
	/** @type {{type: String, roles: String, partners: String}} */ { type, roles, partners }
)}
	<div class="project-page__details">
		<table>
			<tbody>
				<tr>
					<td class="project-page__detail-title">{m.word_type()}</td>
					<td>{type}</td>
				</tr>
				<tr>
					<td class="project-page__detail-title">{m.word_tech()}</td>
					<td>{infosUnilingual[projectId].tech}</td>
				</tr>
				<tr>
					<td class="project-page__detail-title">{m.word_roles()}</td>
					<td>{roles}</td>
				</tr><tr>
					<td class="project-page__detail-title">{m.word_year()}</td>
					<td>{infosUnilingual[projectId].year}</td>
				</tr>
				<tr>
					<td class="project-page__detail-title">{m.word_partners()}</td>
					<td>{partners}</td>
				</tr>
			</tbody>
		</table>

		<a href={infosUnilingual[projectId].projectURL} class="project-page__visit-btn" target="_blank"
			>{m.btn_visit_project()}</a
		>
	</div>
{/snippet}

{#if projectId === 'vehicle'}
	{@render details({
		type: `${m.tag_dashboard()}`,
		roles: `${m.word_conceptualization()}, ${m.word_design()}, ${m.word_implementation()}`,
		partners: `${m.pn_ovgu()}, ${m.pn_university_zurich()}`
	})}
{/if}

{#if projectId === 'methane'}
	{@render details({
		type: `${m.tag_visual_data_story()}`,
		roles: `${m.word_conceptualization()}, ${m.word_design()}, ${m.word_implementation()}`,
		partners: `Data&Design`
	})}
{/if}

{#if projectId === 'characterization'}
	{@render details({
		type: m.tag_analytical_report(),
		roles: `${m.word_conceptualization()}, ${m.word_design()}, ${m.word_implementation()}`,
		partners: m.pn_ovgu()
	})}
{/if}

{#if projectId === 'endovis'}
	{@render details({
		type: m.tag_analytical_report(),
		roles: `${m.word_conceptualization()}, ${m.word_design()}, ${m.word_implementation()}`,
		partners: m.pn_ovgu()
	})}
{/if}

{#if projectId === 'exex'}
	{@render details({
		type: m.tag_visual_data_story(),
		roles: `${m.word_conceptualization()}, ${m.word_design()}, ${m.word_implementation()}`,
		partners: `${m.pn_ovgu()}, ${m.pn_university_zurich()}`
	})}
{/if}
