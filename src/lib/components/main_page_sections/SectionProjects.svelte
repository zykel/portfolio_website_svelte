<script>
	import * as m from '$lib/paraglide/messages.js';
	import ProjectCard from '$lib/components/main_page_sections/ProjectCard.svelte';
	import { fade } from 'svelte/transition';
	import { languageTag } from '$lib/paraglide/runtime';

	const projectInfos = [
		{
			id: 'vehicle',
			title: m['vehicle_project_title'](),
			description: m['vehicle_project_description_short'](),
			type: m['tag_visualization_system'](),
			video: 'vehicle-teaser',
			url: 'projects/vehicle',
			videoSrc: '/teaser_meltt.mp4'
		},
		{
			id: 'tutorials',
			title: m['tutorials_project_title'](),
			description: m['tutorials_project_description_short'](),
			type: m['tag_interactive_notebook'](),
			video: 'tutorials-teaser',
			url: 'projects/teaching_tutorials',
			videoSrc: '/teaser_d3_tutorial.mp4'
		},
		{
			id: 'methane',
			title: m.methane_project_title(),
			description: m['methane_project_description_short'](),
			type: m.tag_visual_data_story(),
			video: 'methane-teaser',
			url: 'projects/methane',
			videoSrc: '/teaser_methane.mp4'
		},
		{
			id: 'characterization',
			title: m['characterization_project_title'](),
			description: m['characterization_project_description_short'](),
			type: m['tag_interactive_notebook'](),
			video: 'characterization-teaser',
			url: 'projects/characterization',
			videoSrc: '/teaser_characterization.mp4'
		},
		{
			id: 'endovis',
			title: m['endovis_project_title'](),
			description: m['endovis_project_description_short'](),
			type: m['tag_visualization_system'](),
			video: 'endovis-teaser',
			url: 'projects/endovis',
			videoSrc: '/teaser_endovis.mp4'
		},
		{
			id: 'exex',
			title: m['exex_project_title'](),
			description: m['exex_project_description_short'](),
			type: m['tag_visual_data_story'](),
			video: 'exex-teaser',
			url: 'projects/exex',
			videoSrc: '/teaser_exex.mp4'
		}
	];
</script>

<section id="projects">
	<div class="center-container">
		<div class="slim-fit-container">
			<div class="section-title-grid">
				<div id="projects-title-container" class="section-title-container {languageTag()}">
					<h1 id="projects-title" class="light-font to-fade-in {languageTag()}">
						<a class="section-title-a" href="#projects-title">{m['sec_title_projects']()}</a>
					</h1>
				</div>
				<div id="projects-title-rectangle" class="section-title-rectangle"></div>
			</div>
		</div>
	</div>

	<div id="projects-grid">
		{#each projectInfos as projectInfo, idx}
			<ProjectCard {projectInfo} isSectionTitleAnimationTrigger={idx === 0} />
		{/each}
	</div>
</section>
