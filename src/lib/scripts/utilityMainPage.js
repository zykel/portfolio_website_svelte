import { select } from 'd3-selection';

export const createIntersectionHandlerForSectionTitles = () => {
	// More sveltey alternative: https://www.npmjs.com/package/svelte-intersection-observer
	// Section title fade in on scroll
	const intersectionObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			// Get the id of the element that is intersecting
			const target = /** @type {HTMLElement} */ (entry.target);
			const section = target.dataset.triggerRef;

			if (entry.isIntersecting) {
				select(`#${section}-title`).classed('dark-font', true);
			} else {
				select(`#${section}-title`).classed('dark-font', false);
			}
		});
	});

	const sectionTitleRevealTrigger = document.querySelectorAll('.project-animation-trigger');

	sectionTitleRevealTrigger.forEach((el) => intersectionObserver.observe(el));
};

export const setupPage = () => {
	// TODO: Maybe a bit more sveltey?
	const pageLoadAnimation = document.getElementById('page-load-animation');

	// Preload the videos (necessary for safari)
	// let videos = document.querySelectorAll('.teaser-video');
	// videos.forEach((video) => {
	// 	const videoElement = /** @type {HTMLVideoElement} */ (video);
	// 	videoElement.load();
	// });

	// Ensure that fade in happens only upon page load
	// Array.from(document.getElementsByClassName('to-fade-in')).forEach((node) =>
	// 	node.classList.add('fadeIn')
	// );

	if (pageLoadAnimation) pageLoadAnimation.style.display = 'none';
};
