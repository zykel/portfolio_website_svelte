<script>
	import {
		startProjectVideoPlayback,
		pauseProjectVideoPlayback
	} from '$lib/scripts/utilityCrosspage';

	let { videoId, videoElement } = $props();
</script>

<svg
	class="play-button-svg play-button-main-page"
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 100 100"
	data-video-id={videoId}
	role="button"
	tabindex="0"
	onclick={() => {
		// Toggle the video playback and the playback symbols
		// Toggle the video playback
		if (videoElement.paused) {
			// Ensure that no two videos are running at the same time
			// Pause all videos
			document.querySelectorAll('.teaser-video').forEach((videoElementOtherToCast) => {
				const videoElementOther = /** @type {HTMLVideoElement} */ (videoElementOtherToCast);
				const videoId = videoElementOther.getAttribute('data-video-id');
				if (videoId) pauseProjectVideoPlayback(videoElementOther, videoId, true);
			});

			// Play the actual video
			startProjectVideoPlayback(videoElement, videoId);
		} else {
			// Play the actual video
			pauseProjectVideoPlayback(videoElement, videoId);
		}
	}}
	onkeydown={(event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			// Add the same logic as in the onclick handler
		}
	}}
>
	<path
		class="video-btn-frame-path"
		d="M 19.355326,4.9999998 H 80.644673 C 88.597525,4.9999998 95,11.402475 95,19.355326 V 80.644673 C 95,88.597525 88.597525,95 80.644673,95 H 19.355326 C 11.402475,95 5,88.597525 5,80.644673 V 19.355326 C 5,11.402475 11.402475,4.9999998 19.355326,4.9999998 Z"
	/>
	<path
		class="video-btn-play-path"
		d="m 39.86167,49.999611 c 0,0 0,-22.734135 0,-22.734135 0,0 29.949322,22.734821 29.949322,22.734821 0,0 -29.949322,22.733448 -29.949322,22.733448 0,0 0,-22.734134 0,-22.734134 z"
	/>
	<g class="video-btn-pause-path-g" style="display: none;">
		<path class="video-btn-pause-path" d="m 38.80331,27.265484 c 0,0 0,45.468274 0,45.468274" />
		<path class="video-btn-pause-path" d="m 61.196734,27.265486 c 0,0 0,45.46827 0,45.46827" />
	</g>
</svg>
