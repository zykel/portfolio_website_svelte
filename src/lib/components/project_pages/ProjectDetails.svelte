<script>
	import * as m from '$lib/paraglide/messages';
	import infos from '$lib/assets/nonMultilingualSubpageInfos.json';

	/** @type {{ [key: string]: { projectURL: string; year: string; } }} */
	let infosTyped = infos;

	let { projectId } = $props();
</script>

{#snippet details(
	/** @type {{type: String, tech: String, roles: String, partners: String}} */ {
		type,
		tech,
		roles,
		partners
	}
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
					<td>JavaScript, D3.js, Observable notebooks</td>
				</tr>
				<tr>
					<td class="project-page__detail-title">{m.word_roles()}</td>
					<td>{roles}</td>
				</tr><tr>
					<td class="project-page__detail-title">{m.word_year()}</td>
					<td>{infosTyped[projectId].year}</td>
				</tr>
				<tr>
					<td class="project-page__detail-title">{m.word_partners()}</td>
					<td>{partners}</td>
				</tr>
			</tbody>
		</table>

		<a href={infosTyped[projectId].projectURL} class="project-page__visit-btn" target="_blank"
			>{m.btn_visit_project()}</a
		>
	</div>
{/snippet}

{#if projectId === 'endovis'}
	{@render details({
		type: m.tag_interactive_notebook(),
		tech: '',
		roles: `${m.word_conceptualization()}, ${m.word_design()}, ${m.word_implementation()}`,
		partners: m.pn_ovgu()
	})}
{/if}

<!-- {#if projectId === 'exex'}
	{@render p(m.exex_description_paragraph_1())}
	{@render p(m.exex_description_paragraph_2())}
{/if} -->
