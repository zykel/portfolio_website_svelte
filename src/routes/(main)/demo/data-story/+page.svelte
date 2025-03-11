<script>
	import { scaleBand, scaleLinear } from 'd3-scale';
	import { max } from 'd3-array';
	import { Tween } from 'svelte/motion';
	import Scrolly from '$lib/components/demo/story/Scrolly.svelte';
	import SvgPart1 from '$lib/components/demo/story/SvgPart1.svelte';
	import SvgPart2 from '$lib/components/demo/story/SvgPart2.svelte';
	import { get } from 'svelte/store';

	/**
	 * @typedef {Object} PizzaDataEntry
	 * @property {string} category - The category of the pizza (e.g., "Classic").
	 * @property {number} count - The number of times this pizza was sold.
	 * @property {string} name - The name of the pizza (e.g., "The Hawaiian Pizza").
	 * @property {number} price - The price of the pizza.
	 */

	let { data } = $props();

	/** @type {PizzaDataEntry[]} */
	const dataPizzas = $derived(data.pizzaData);
	const dataTime = $derived(data.timeData);

	$inspect(dataPizzas);
	$inspect(dataTime);

	let width = $state(0);
	let height = $state(0);

	const margin = { top: 20, right: 20, bottom: 20, left: 20 };

	const dataStepText = $derived([
		'Here at Pizza Bianca we offer four types of pizzas.',
		'We offer 9 types of "Supreme" pizzas',
		'9 types of "Veggie" pizzas',
		'8 types of "Classic" pizzas',
		'and 6 types of "Chicken" pizzas.',
		'Select a category to explore the pizzas in that category.'
	]);

	let stepNr = $state(0);

	const xScale = $derived(scaleBand());

	const yScale = $derived(scaleLinear());

	const dataTweened = $derived([]);

	let selectedPizza = $state('');
</script>

<div class="part-container">
	<div class="svg-div" bind:clientWidth={width} bind:clientHeight={height}>
		{#if width > 0 && height > 0}
			<SvgPart1 data={dataPizzas} {width} {height} {stepNr} />
		{/if}
	</div>
	<div class="steps">
		<Scrolly bind:value={stepNr}>
			{#each dataStepText as text, i}
				<div
					class="step {i === dataStepText.length - 1 ? 'last-step' : ''}"
					class:active={stepNr === i}
				>
					<p class="step-p">{text}</p>
				</div>
			{/each}
		</Scrolly>
	</div>
</div>

{#if selectedPizza !== ''}
	<div class="part-container">
		<div class="svg-div" bind:clientWidth={width} bind:clientHeight={height}>
			{#if width > 0 && height > 0}
				<SvgPart2 {dataTweened} {width} {height} />
			{/if}
		</div>
		<div class="steps">
			<Scrolly bind:value={stepNr}>
				{#each dataStepText as _, i}
					<div class="step" class:active={stepNr === i}>
						<p>Hi there</p>
					</div>
				{/each}
			</Scrolly>
		</div>
	</div>
{/if}

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	.part-container {
		position: relative;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.svg-div {
		position: sticky;
		width: 900px;
		height: 80vh;
		top: 10vh;
		margin: 10vh 0;
	}

	.step {
		height: 40vh;
		margin: 30vh 0;
		padding: 1vh;
		/* background-color: rgba(201, 144, 144, 0.411); */
		display: flex;
		justify-content: center;
		place-items: center;
		color: gray;
		font-size: 1.5rem;
	}
	.last-step {
		margin-bottom: 70vh;
	}

	.step-p {
		width: 300px;
		padding: 1rem;
		background-color: rgb(253, 244, 231);
		border-radius: 1rem;
		text-align: center;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	.step.active {
		color: black;
	}

	.steps {
		position: relative;
		z-index: 2;
		pointer-events: none;
	}
</style>
