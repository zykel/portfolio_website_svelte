/**
 * @param {HTMLVideoElement | null} videoElement
 * @param {String} videoId
 * @param {Boolean} underlineCorrespondingTitle
 */
export const startProjectVideoPlayback = (
	videoElement,
	videoId,
	underlineCorrespondingTitle = false
) => {
	// If the video is also a project image on the main page, underline the corresponding project title
	if (underlineCorrespondingTitle) {
		// const videoId = target.getAttribute('data-video-id');
		const projectTitleNode = /** @type {HTMLElement} */ (
			document.querySelector(`.project-title[data-video-id="${videoId}"]`)
		);
		if (projectTitleNode) projectTitleNode.style.textDecoration = 'underline';
	}

	if (!videoElement) return;

	// Play the video
	videoElement.play();
	// Find the play/pause buttons and toggle them
	// Find the symbols
	const playSymbol = /** @type {HTMLElement} */ (
		document.querySelector(`.play-button-svg[data-video-id="${videoId}"] > .video-btn-play-path`)
	);
	const pauseSymbol = /** @type {HTMLElement} */ (
		document.querySelector(`.play-button-svg[data-video-id="${videoId}"] > .video-btn-pause-path-g`)
	);
	// Toggle the symbols (if they exist)
	if (playSymbol && pauseSymbol) {
		playSymbol.style.display = 'none';
		pauseSymbol.style.display = 'block';
	} else {
		console.warn(`Could not find playSymbol and/or pauseSymbol for videoId ${videoId}`);
	}
};

/**
 * @param {HTMLVideoElement | null} videoElement
 * @param {String} videoId
 * @param {Boolean} removeUnderlineCorrespondingTitle
 */
export const pauseProjectVideoPlayback = (
	videoElement,
	videoId,
	removeUnderlineCorrespondingTitle = false
) => {
	// If the video is also a project image on the main page, remove underline from the corresponding project title
	if (removeUnderlineCorrespondingTitle) {
		// const videoId = target.getAttribute('data-video-id');
		const projectTitleNode = /** @type {HTMLElement} */ (
			document.querySelector(`.project-title[data-video-id="${videoId}"]`)
		);
		if (projectTitleNode) projectTitleNode.style.textDecoration = '';
	}

	if (!videoElement) return;

	// Pause the video
	videoElement.pause();
	// Find the play/pause buttons and toggle them
	// Find the symbols
	const playSymbol = /** @type {HTMLElement} */ (
		document.querySelector(`.play-button-svg[data-video-id="${videoId}"] > .video-btn-play-path`)
	);
	const pauseSymbol = /** @type {HTMLElement} */ (
		document.querySelector(`.play-button-svg[data-video-id="${videoId}"] > .video-btn-pause-path-g`)
	);
	// Toggle the symbols (if they exist)
	if (playSymbol && pauseSymbol) {
		playSymbol.style.display = 'block';
		pauseSymbol.style.display = 'none';
	} else {
		console.warn(`Could not find playSymbol and/or pauseSymbol for videoId ${videoId}`);
	}
};
