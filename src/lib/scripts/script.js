// @ts-nocheck
import * as d3 from 'd3';

console.log('in script');

// // Section title fade in on scroll
// const intersectionObserver = new IntersectionObserver((entries) => {
// 	console.log('ntersection');
// 	entries.forEach((entry) => {
// 		// Get the id of the element that is intersecting
// 		const section = entry.target.dataset.triggerRef;

// 		if (entry.isIntersecting) {
// 			d3.select(`#${section}-title`).classed('dark-font', true);
// 		} else {
// 			d3.select(`#${section}-title`).classed('dark-font', false);
// 		}
// 	});
// });

// const sectionTitleRevealTrigger = document.querySelectorAll('.project-animation-trigger');

// sectionTitleRevealTrigger.forEach((el) => intersectionObserver.observe(el));

// Create/update contact line svg
// const updateContactLineSvg = function () {
// 	// To determine fan factor for y position of points
// 	const fanFactor = (x, xStart, xEnd) => {
// 		const w = xEnd - xStart;
// 		return 1 - Math.abs((x - xStart - w / 2) / (w / 2));
// 	};

// 	// To create random points
// 	function randomPoints(i) {
// 		const points = [];
// 		const xStart = 0; //document.getElementById('hi-text-first-part').getBoundingClientRect().right;
// 		const xEnd = width; //document.getElementById('hi-text-second-part').getBoundingClientRect().left;
// 		const nrSteps = 8 + i; //+ Math.random() * 6 - 3;
// 		const xArray = d3.range(xStart, xEnd + (xEnd - xStart) / nrSteps, (xEnd - xStart) / nrSteps);
// 		xArray.forEach((x) => {
// 			const y = yStart + (Math.random() * 100 - 50) * fanFactor(x, xStart, xEnd) * 2; // add some randomness
// 			points.push([x, y]);
// 		});
// 		points[points.length - 1][1] = yStart; // ending y-coordinate
// 		return points;
// 	}

// 	//const width = 928; // uncomment for responsive width
// 	const height = 200;
// 	const width = document.documentElement.clientWidth;
// 	const svg = d3
// 		.select('#lines-svg')
// 		// .attr("viewBox", [0, 0, width, height])
// 		// .attr("width", width)
// 		// .attr("height", height)
// 		.attr('style', `width: ${width}px; height: ${height}px;`);
// 	const pathGroup = svg.selectAll('g').data([0]).join('g');

// 	// Define line generator
// 	const line = d3.line().curve(d3.curveBasis);

	const yStart = 100;
	const amp = 1;
	const per = 0.9;

	// const updatePaths = () => {
	// 	// Generate multiple lines
	// 	const pathData = [];
	// 	d3.range(5).forEach((d, i) => {
	// 		pathData.push({ id: i, points: randomPoints(i) });
	// 	});

	// 	pathGroup
	// 		.selectAll('path')
	// 		.data(pathData, (d) => d.id)
	// 		.join('path')
	// 		.attr('fill', 'none')
	// 		.attr('stroke', 'white') //"#f2f2f2")
			.transition()
			.ease(d3.easeElastic.amplitude(amp).period(per))
			.duration((d, i) => 1500 + i * 100)
			.delay((d, i) => i * 60)
// 			.attr('d', (d) => line(d.points));
// 	};

// 	updatePaths();

// 	// Interaction
// 	d3.selectAll('.contact-button')
// 		.on('pointerenter', (event) => {
// 			updatePaths();
// 		})
// 		.on('pointerleave', (event) => {
// 			updatePaths();
// 		});
// };

// updateContactLineSvg();

// window.addEventListener('resize', updateContactLineSvg);

// // Page load animation
// window.addEventListener('load', function () {
// 	const pageLoadAnimation = document.getElementById('page-load-animation');

// 	// Preload the videos (necessary for safari)
// 	let videos = document.querySelectorAll('.teaser-video');
// 	videos.forEach((video) => {
// 		video.load();
// 	});
// 	// document.querySelectorAll('#hero-video').load();

// 	// Ensure that fade in happens only upon page load
// 	Array.from(document.getElementsByClassName('to-fade-in')).forEach((node) =>
// 		node.classList.add('fadeIn')
// 	);

// 	pageLoadAnimation.style.display = 'none';
// });
