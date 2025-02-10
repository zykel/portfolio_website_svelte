<script>
	import {
		pauseProjectVideoPlayback,
		startProjectVideoPlayback
	} from '$lib/scripts/utilityCrosspage';
	import PlayButtonSvg from '../PlayButtonSVG.svelte';

	let { src, caption, wide = false, videoId } = $props();

	/** @type {HTMLVideoElement | null} */
	let videoElement = $state(null);
</script>

<div class="project-page__impression-{wide ? 'wide' : 'small'}">
	<video
		bind:this={videoElement}
		loop
		muted
		playsinline
		class="teaser-video project-page__impression-pic"
		data-video-id={videoId}
		onmouseenter={() => startProjectVideoPlayback(videoElement, videoId, false)}
		onmouseleave={() => pauseProjectVideoPlayback(videoElement, videoId, false)}
	>
		<source {src} type="video/mp4" />
		Your browser does not support the video tag.
	</video>
	<div class="impression-caption-container">
		<div class="impression-caption">{caption}</div>
		<PlayButtonSvg {videoId} {videoElement} placedOnMainPage={false} />
	</div>
</div>
