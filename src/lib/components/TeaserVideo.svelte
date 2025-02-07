<script>
	import {
		openProjectURL,
		startProjectVideoPlayback,
		pauseProjectVideoPlayback
	} from '$lib/scripts/utilityCrosspage.js';

	let { projectInfo, isProjectImg = false, videoElement = $bindable() } = $props();
</script>

<video
	bind:this={videoElement}
	loop
	muted
	playsinline
	class="teaser-video{isProjectImg ? ' project-img' : ''}"
	data-video-id={projectInfo.video}
	onclick={(e) => openProjectURL(projectInfo.url, e.currentTarget)}
	onmouseenter={() => startProjectVideoPlayback(videoElement, projectInfo.video, isProjectImg)}
	onmouseleave={() => pauseProjectVideoPlayback(videoElement, projectInfo.video, isProjectImg)}
>
	<source src={projectInfo.videoSrc} type="video/mp4" />
	<!-- <source src="movie.ogg" type="video/ogg"> -->
	Your browser does not support the video tag.
</video>

<!-- .on('mouseenter', (event, d) => {
    // If the video is also a project image on the main page, underline the corresponding project title
    // const projectImgMaybe = d3.select(event.target);
    // if (projectImgMaybe.classed('project-img')) {
    //     const videoId = projectImgMaybe.attr('data-video-id');
    // Whould need to give that data value to the project title again if I want to make that work
    //     d3.select(`.project-title[data-video-id="${videoId}"]`).style('text-decoration', 'underline');
    // }

    // Play the video
    event.target.play();
    // Find the play/pause buttons and toggle them
    // Get the video id
    const videoId = event.target.getAttribute('data-video-id');
    // Find the symbols
    const playSymbol = document.querySelector(`.play-button-svg[data-video-id="${videoId}"] > .video-btn-play-path`);
    const pauseSymbol = document.querySelector(`.play-button-svg[data-video-id="${videoId}"] > .video-btn-pause-path-g`);
    // Toggle the symbols (if they exist)
    if (playSymbol && pauseSymbol) {
      playSymbol.style.display = 'none';
      pauseSymbol.style.display = 'block';
    } else {
        console.warn(`Could not find playSymbol and/or pauseSymbol for videoId ${videoId}`);
    }
  }) -->
