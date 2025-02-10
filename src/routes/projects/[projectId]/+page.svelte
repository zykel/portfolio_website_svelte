<script>
	import * as m from '$lib/paraglide/messages.js';
	import ProjectTitle from '$lib/components/project_pages/ProjectTitle.svelte';
	import Paragraphs from '$lib/components/project_pages/Paragraphs.svelte';
	import ProjectDetails from '$lib/components/project_pages/ProjectDetails.svelte';
	import ProjectImpressions from '$lib/components/project_pages/ProjectImpressions.svelte';
	import { infosUnilingual } from '$lib/assets/nonMultilingualSubpageInfos.js';

	let { data } = $props();

	const projectId = /** @type {string} */ (data.projectId);
</script>

<div class="center-container">
	<div class="slim-fit-container">
		<ProjectTitle {projectId} />
		<img
			src="/projects/{projectId}/title_pic.png"
			alt="A screenshot of the project"
			class="project-page__title-pic"
		/>

		<div class="project-page__text-content">
			<div class="project-page__description">
				<Paragraphs {projectId} />
				{#if infosUnilingual[projectId].publication !== ''}
					<p class="project-page__paragraph publication">
						{@html infosUnilingual[projectId].publication}
					</p>
				{/if}
			</div>
			<ProjectDetails {projectId} />
		</div>
		<ProjectImpressions {projectId} />
	</div>
</div>
