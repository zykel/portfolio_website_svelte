<script>
	import {
		getCategoryDataStepped,
		schemeObservable10Light,
		categoryColorScale,
		getToppingsData
	} from '$lib/scripts/utilityStory.js';
	import { scaleLinear } from 'd3-scale';
	import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';
	import { transform } from '@observablehq/plot';
	import { interpolateTransformSvg } from 'd3-interpolate';
	import { pie, arc } from 'd3-shape';
	import { stopPropagation } from 'svelte/legacy';
	import { Tween } from 'svelte/motion';
	import { elasticOut } from 'svelte/easing';
	import PizzaPie from './charts/PizzaPie.svelte';
	import PizzaBubbles from './charts/PizzaBubbles.svelte';
	import { getContext } from 'svelte';
	import WelcomeText from './charts/WelcomeText.svelte';

	/**
	 * @typedef {Object} PizzaDataEntry
	 * @property {string} category - The category of the pizza (e.g., "Classic").
	 * @property {number} count - The number of times this pizza was sold.
	 * @property {string} name - The name of the pizza (e.g., "The Hawaiian Pizza").
	 * @property {number} price - The price of the pizza.
	 */

	let {
		/** @type {PizzaDataEntry[]} */ data,
		width,
		height,
		stepNr,
		categorySelected = $bindable()
	} = $props();

	const margin = { top: 200, right: 20, bottom: 200, left: 20 };

	const startStep1_1 = 1;
	const startStep1_2 = 6;

	const interactionStepReached = $derived(stepNr === startStep1_2 - 1);

	let pizzaNameHovered = $state('');

	const getIdFromStepNrPart1 = getContext('getIdFromStepNrPart1');
	const getStepNrFromIdPart1 = getContext('getStepNrFromIdPart1');
	$effect(() => {
		if (stepNr === getStepNrFromIdPart1('show_example_pizza_price') - 1) pizzaNameHovered = '';

		if (
			['show_example_pizza_price', 'show_example_pizza_popularity'].includes(
				getIdFromStepNrPart1(stepNr)
			)
		) {
			pizzaNameHovered = data.find(
				(/** @type {{ category: string; }} */ d) => d.category === categorySelected
			)?.name;
		}

		if (stepNr === getStepNrFromIdPart1('reveal_pizza_popularity_axis')) pizzaNameHovered = '';
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 {width} {height}"
	onpointerdown={(event) => {
		if (stepNr == getStepNrFromIdPart1('allow_pizza_bubbles_interaction')) pizzaNameHovered = '';
	}}
>
	<line
		class="pizza-bubbles-seperator"
		x1={width / 2}
		x2={width / 2}
		y1={margin.top / 2}
		y2={height - margin.bottom / 2}
		stroke="lightgray"
		stroke-width="2"
		stroke-dasharray="5 5"
		style:opacity={stepNr >= getStepNrFromIdPart1('reveal_pizza_popularity_axis') ? 1 : 0}
		style:transition="opacity 1s"
	/>
	<WelcomeText {width} {height} {stepNr} />
	<PizzaPie
		{data}
		{width}
		{height}
		{stepNr}
		{margin}
		{startStep1_1}
		{startStep1_2}
		{interactionStepReached}
		bind:categorySelected
	/>
	{#if stepNr >= startStep1_2 - 1}
		<PizzaBubbles
			{data}
			{width}
			{height}
			{margin}
			{startStep1_2}
			{stepNr}
			{categorySelected}
			bind:pizzaNameHovered
		/>
	{/if}
</svg>

<!-- {#if interactionStepReached && categorySelected && stepNr === startStep1_2 - 1}
	<div class="continue-button-container">
		<a href="#step-text-6" class="continue-button">Continue</a>
	</div>
{/if} -->

<style>
	svg {
		/* background-color: #f0f0f0; */
		/* border: 1px solid #ccc; */
	}

	.continue-button-container {
		position: absolute;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
	}

	.continue-button {
		font-family: SourGummy, sans-serif;
		background-color: #ffffff;
		border: 2px solid #000000;
		border-radius: 3rem;
		padding: 0.5rem 1rem;
		font-size: 1.5rem;
		cursor: pointer;
		color: #000000;
		text-decoration: none;
	}
	.continue-button:hover {
		background-color: #333333;
		border: 2px solid #333333;
		color: #ffffff;
	}
</style>
