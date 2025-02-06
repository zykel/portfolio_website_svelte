<script>
	let { projectInfo } = $props();

	// JSDoc
	/** Open URL in new tab and pause video on mobile
	 * @param {string | URL | undefined} url
	 * @param {HTMLElement} node
	 */
	const openProjectURL = function (url, node) {
		// In case of mobile use, a mouseleave event is not fired on tapping, so the video playing in the teaser won't pause
		// TODO: This could maybe be solved more elegantly using svelte
		let event = new MouseEvent('mouseleave', {
			view: window,
			bubbles: true,
			cancelable: true
		});
		node.dispatchEvent(event);

		window.open(url, '_blank');
	};
</script>

<div class="project-card video-parent project-animation-trigger" data-trigger-ref="projects">
	<video
		loop
		muted
		playsinline
		class="project-img teaser-video"
		data-video-id={projectInfo.video}
		onclick={(e) => openProjectURL(projectInfo.url, e.currentTarget)}
	>
		<source src={projectInfo.videoSrc} type="video/mp4" />
		<!-- <source src="movie.ogg" type="video/ogg"> -->
		Your browser does not support the video tag.
	</video>

	<div class="project-below-container">
		<a class="project-below-text-container" href={projectInfo.url} target="_blank">
			<div class="project-title-container">
				<p class="project-title">{projectInfo.title}</p>
			</div>
			<p class="project-description">{projectInfo.description}</p>
			<div class="project-type-container">
				<p class="project-type">{projectInfo.type}</p>
			</div>
		</a>
		<div class="project-below-play-btn-container">
			<svg
				class="play-button-svg play-button-main-page"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 100 100"
				data-video-id={projectInfo.video}
			></svg>
		</div>
	</div>
</div>
