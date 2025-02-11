<script>
	import * as m from '$lib/paraglide/messages.js';
	import { line, curveBasis } from 'd3-shape';
	import { range } from 'd3-array';
	import { Tween } from 'svelte/motion';
	import { interpolateString } from 'd3-interpolate';
	import { easeElastic } from 'd3-ease';
	import { onMount } from 'svelte';

	let width = $state(0);
	const height = 200;
	const yStart = 100;
	const amp = 1;
	const per = 0.9;

	const getFanFactor = (/** @type {number} */ x) => {
		if (width === 0) return 1;
		return 1 - Math.abs((x - width / 2) / (width / 2));
	};

	/**
	 * @param {number} i
	 */
	function getRandomPoints(i) {
		/** @type {any[][]} */
		const points = [];
		const xStart = 0;
		const xEnd = width === 0 ? 1 : width;
		const nrSteps = 8 + i;

		const xArray = range(xStart, xEnd + (xEnd - xStart) / nrSteps, (xEnd - xStart) / nrSteps);

		xArray.forEach((/** @type {number} */ x) => {
			const y = yStart + (Math.random() * 100 - 50) * getFanFactor(x) * 2; // add some randomness
			points.push([x, y]);
		});
		points[points.length - 1][1] = yStart; // ending y-coordinate
		return points;
	}

	const lineGenerator = line().curve(curveBasis);

	/**
	 * @type {any[]}
	 */
	let pathData = $state([]);

	onMount(() => {
		pathData = range(5).map((/** @type {any} */ d, /** @type {number} */ i) => {
			const points = getRandomPoints(i);
			const pathStringInitial = lineGenerator(points);
			const pathStringTween = new Tween(pathStringInitial, {
				interpolate: interpolateString,
				duration: 1500 + i * 100,
				delay: i * 60,
				easing: easeElastic.amplitude(amp).period(per)
			});
			return { id: i, pathStringTween };
		});
	});

	const updatePathData = () => {
		pathData.forEach((/** @type {any} */ pathDatum) => {
			const points = getRandomPoints(pathDatum.id);
			pathDatum.pathStringTween.target = lineGenerator(points);
		});
	};
</script>

<section id="contact" class="center-col-container" bind:clientWidth={width}>
	<div class="slim-fit-container">
		<div class="section-title-grid">
			<div class="section-title-container">
				<h1 id="contact-title" class="light-font">
					<a class="section-title-a" href="#contact-title">{m.title_contact()}</a>
				</h1>
			</div>
			<div id="contact-title-rectangle" class="section-title-rectangle"></div>
		</div>
	</div>

	<div id="contact-content">
		<p class="contact-question project-animation-trigger" data-trigger-ref="contact">
			{m.sec_contact_question()}
		</p>
		<h1 class="call-contact">{m.sec_contact_invite()}</h1>
		<div id="contact-button-and-svg-grid">
			<div id="lines-svg-container">
				<svg id="lines-svg" xmlns="http://www.w3.org/2000/svg" {width} {height}>
					{#each pathData as pathDatum, i}
						<path d={pathDatum.pathStringTween.current} fill="none" stroke="white" />
					{/each}
				</svg>
			</div>
			<div id="contact-button-container">
				<a
					href="mailto:mail@benediktmayer.com"
					class="contact-button"
					onpointerenter={updatePathData}
					onpointerleave={updatePathData}>mail@benediktmayer.com</a
				>
				<a
					href="https://www.linkedin.com/in/benedikt-mayer-1981271b8/"
					class="contact-button"
					target="_blank"
					onpointerenter={updatePathData}
					onpointerleave={updatePathData}>LinkedIn</a
				>
			</div>
		</div>
	</div>
</section>
