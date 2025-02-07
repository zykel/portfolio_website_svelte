<script>
	import PlayButtonSVG from '$lib/components/PlayButtonSVG.svelte';
	import TeaserVideo from '$lib/components/TeaserVideo.svelte';

	let { projectInfo } = $props();

	/** @type {HTMLVideoElement | null} */
	let videoElement = $state(null);
</script>

<div class="project-card video-parent project-animation-trigger" data-trigger-ref="projects">
	<TeaserVideo {projectInfo} isProjectImg={true} bind:videoElement />

	<div class="project-below-container">
		<a class="project-below-text-container" href={projectInfo.url} target="_blank">
			<div class="project-title-container">
				<p class="project-title" data-video-id={projectInfo.video}>{projectInfo.title}</p>
			</div>
			<p class="project-description">{projectInfo.description}</p>
			<div class="project-type-container">
				<p class="project-type">{projectInfo.type}</p>
			</div>
		</a>
		<div class="project-below-play-btn-container">
			<PlayButtonSVG videoId={projectInfo.video} {videoElement} />
		</div>
	</div>
</div>
