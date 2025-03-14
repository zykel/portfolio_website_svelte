<script>
	import { schemeObservable10Light } from '$lib/scripts/utilityStory.js';
	import { Tween } from 'svelte/motion';
	import pizza_icon from '$lib/assets/pizza_icon.svg';
	import { range } from 'd3-array';
	import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';
	import PizzaIcon from './PizzaIcon.svelte';
	import { backIn } from 'svelte/easing';

	let { width, height, stepNr } = $props();

	const welcomeTextArray = ['Welcome to', 'PIZZA BIANCA!'];

	const yOffset = new Tween(0, { easing: backIn });
	$effect(() => {
		yOffset.target = stepNr === 0 ? 0 : -2 * height;
	});

	const pizzaIconRadiusForce = $derived(Math.max(width, height) / 10);
	const pizzaIconRadius = $derived(pizzaIconRadiusForce * 0.8);
	const nrPizzaIcons = 40;

	const y0RandomPositions = range(nrPizzaIcons).map(() => {
		return (
			0.35 * height + 0.4 * height * (Math.sin(Math.random() * Math.PI) - 0.5 + Math.random() * 0.5)
		);
	});

	const getDataForce = () => {
		const dataForce = y0RandomPositions.map((y0) => {
			return {
				x0: width / 2,
				// y0: height / 2,
				y0,
				r: pizzaIconRadiusForce
			};
		});

		const simulation = forceSimulation(dataForce)
			.force(
				'x',
				forceX((/** @type {{ x0: any; }} */ d) => d.x0)
			)
			.force(
				'y',
				forceY((/** @type {{ y0: any; }} */ d) => d.y0)
			)
			.force(
				'collide',
				forceCollide((/** @type {{ r: any; }} */ d) => d.r)
			);

		const ticks = 100;
		for (let i = 0; i < ticks; i++) simulation.tick();

		return dataForce;
	};

	const pizzaIconData = $derived(getDataForce());

	// const pizzaIconWidth = 40;
	// const nrPizzaCols = Math.floor(320 / pizzaIconWidth);
	const getIconOpacity = (x, y) => {
		const distanceMax = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);
		const distance = Math.sqrt((x - width / 2) ** 2 + (y - height / 2) ** 2);
		return (distance / distanceMax) ** 2 * 0.1 + 0;
	};
</script>

<defs>
	<filter id="welcome-text-drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
		<feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="white" />
	</filter>
</defs>

<g
	class="welcome-content"
	transform={`translate(0, ${yOffset.current})`}
	style:opacity={stepNr === 0 ? 1 : 0}
	style:transition="opacity 1s ease"
>
	<g class="pizza-icons">
		{#each pizzaIconData as { x, y, r }}
			<!-- <image
				href={pizza_icon}
				x={x - pizzaIconRadius}
				y={y - pizzaIconRadius}
				width={2 * pizzaIconRadius}
				height={2 * pizzaIconRadius}
				transform="rotate({Math.random() * 360} {x} {y})"
			/> -->
			<PizzaIcon
				x={x - pizzaIconRadius}
				y={y - pizzaIconRadius}
				width={2 * pizzaIconRadius}
				height={2 * pizzaIconRadius}
				transform="rotate({Math.random() * 360} {x} {y})"
				opacity={getIconOpacity(x, y)}
			/>
		{/each}
	</g>
	{#each welcomeTextArray as text, i}
		<text
			x={width / 2}
			y={height / 2 + 30 - 60 * (1 - i) + 10}
			font-size={width < 450 ? '3rem' : '4rem'}
			text-anchor="middle"
			fill="#333333"
			font-weight="bold"
			style:opacity={stepNr == 0 ? 1 : 0}
			style:transition="opacity 1s"
			filter="url(#welcome-text-drop-shadow)"
		>
			{#each text.split(' ') as word, j}
				<tspan fill={schemeObservable10Light[i === 0 ? j : 2 + j]}>{word + ' '}</tspan>
			{/each}
		</text>
	{/each}
</g>
