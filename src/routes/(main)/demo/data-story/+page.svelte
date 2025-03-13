<script>
	import { scaleBand, scaleLinear } from 'd3-scale';
	import { max } from 'd3-array';
	import { Tween } from 'svelte/motion';
	import Scrolly from '$lib/components/demo/story/Scrolly.svelte';
	import SvgPart1 from '$lib/components/demo/story/SvgPart1.svelte';
	import SvgPart2 from '$lib/components/demo/story/SvgPart2.svelte';
	import { get } from 'svelte/store';
	import { setContext } from 'svelte';

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

	let stepNr = $state(0);

	const xScale = $derived(scaleBand());

	const yScale = $derived(scaleLinear());

	const dataTweened = $derived([]);

	let categorySelected = $state('');

	const dataStepTextPart1_1 = $derived([
		{ id: 'intro', text: 'At Pizza Bianca, we offer four types of pizzas.', type: '' },
		{ id: 'reveal_supreme', text: 'We offer 9 types of "Supreme" pizzas...', type: '' },
		{ id: 'reveal_veggie', text: '...9 types of "Veggie" pizzas...', type: '' },
		{ id: 'reveal_classic', text: '...8 types of "Classic" pizzas...', type: '' },
		{ id: 'reveal_chicken', text: '...and 6 types of "Chicken" pizzas.', type: '' },
		{
			id: 'allow_category_select',
			text: 'Select a category to explore the pizzas in that category.',
			type: 'interaction-instructions'
		}
	]);

	const dataStepTextPart1_2 = $derived([
		{
			id: 'reveal_pizza_price_axis',
			text: `On the left, you can see all "${categorySelected}" pizzas, ordered by their price.`,
			type: ''
		},
		{
			id: 'show_example_pizza_price',
			text: `Each circle corresponds to one pizza, for example "${data.pizzaData.find((/** @type {{ category: string; }} */ d) => d.category === categorySelected)?.name}" costs ${data.pizzaData.find((/** @type {{ category: string; }} */ d) => d.category === categorySelected)?.price}&nbsp;$.`,
			type: ''
		},
		{
			id: 'reveal_pizza_popularity_axis',
			text: `On the right, the same pizzas are displayed again, this time based on their popularity. 100 % corresponds to the most bought pizza from the category "${categorySelected}".`,
			type: ''
		},
		{
			id: 'show_example_pizza_popularity',
			text: `As for the price, each circle corresponds to one pizza. For instance, "${data.pizzaData.find((/** @type {{ category: string; }} */ d) => d.category === categorySelected)?.name}" has a popularity of ${Math.round((data.pizzaData.find((/** @type {{ category: string; }} */ d) => d.category === categorySelected)?.count / Math.max(...data.pizzaData.filter((/** @type {{ category: string; }} */ d) => d.category === categorySelected).map((/** @type {{ count: number; }} */ d) => d.count))) * 100)}&nbsp;%.`,
			type: ''
		},
		{
			id: 'allow_pizza_bubbles-interaction',
			text: 'You may explore the pizzas based on their price and popularity.',
			type: 'interaction-instructions'
		}
	]);

	const allStepTexts = $derived([...dataStepTextPart1_1, ...dataStepTextPart1_2]);

	const getIdFromStepNr = (/** @type {number} */ stepNr) => allStepTexts[stepNr]?.id;
	const getStepNrFromId = (/** @type {string} */ id) =>
		allStepTexts.findIndex((/** @type {{ id: string; }} */ d) => d.id === id);

	setContext('getIdFromStepNr', getIdFromStepNr);
	setContext('getStepNrFromId', getStepNrFromId);

	$inspect({ categorySelected });
</script>

<div class="part-container">
	<div
		class="svg-div {allStepTexts[stepNr]?.type === 'interaction-instructions'
			? 'indicate-interaction'
			: ''}"
		bind:clientWidth={width}
		bind:clientHeight={height}
	>
		{#if width > 0 && height > 0}
			<SvgPart1 data={dataPizzas} {width} {height} {stepNr} bind:categorySelected />
		{/if}
	</div>
	<div class="steps">
		<Scrolly bind:value={stepNr}>
			{#each dataStepTextPart1_1 as { id, text, type }, i}
				<div
					class="step {i === dataStepTextPart1_1.length - 1 ? 'last-step' : ''}"
					class:active={stepNr === i}
				>
					<p id="step-text-{id}" class="step-p {type}">
						{type === 'interaction-instructions' ? '➤' : ''}
						{@html text}
					</p>
				</div>
			{/each}
			{#each dataStepTextPart1_2 as { id, text, type }, i}
				{@const stepNrThis = i + dataStepTextPart1_1.length}
				<div
					class="step {i === dataStepTextPart1_2.length - 1
						? 'last-step'
						: ''} {categorySelected === '' ? 'hidden' : ''}"
					class:active={stepNr === stepNrThis}
				>
					<p id="step-text-{id}" class="step-p {type}">
						{type === 'interaction-instructions' ? '➤' : ''}
						{@html text}
					</p>
				</div>
			{/each}
		</Scrolly>
	</div>
</div>

{#if false}
	<div class="part-container">
		<div class="svg-div" bind:clientWidth={width} bind:clientHeight={height}>
			{#if width > 0 && height > 0}
				<SvgPart2 {dataTweened} {width} {height} />
			{/if}
		</div>
		<div class="steps">
			<Scrolly bind:value={stepNr}>
				{#each dataStepTextPart1_1 as _, i}
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
		width: calc(min(900px, 100vw));
		height: 80vh;
		top: 10vh;
		margin: 0;
		transition: box-shadow 0.3s ease-in-out;
		border-radius: 2rem;
		overflow: hidden;
	}
	.indicate-interaction {
		box-shadow: inset 0 0 1rem rgba(0, 0, 0, 0.4);
	}

	.step {
		height: 40vh;
		margin: 0vh 0 70vh 0;
		padding: 1vh;
		/* background-color: rgba(201, 144, 144, 0.411); */
		display: flex;
		justify-content: center;
		place-items: center;
		color: gray;
		font-size: 1.5rem;
	}
	.last-step {
		margin-bottom: 75vh;
	}
	.hidden {
		display: none;
	}

	.step-p {
		width: 300px;
		padding: 1rem;
		background-color: rgb(253, 244, 231);
		border-radius: 1rem;
		text-align: center;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	.interaction-instructions {
		font-style: italic;
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
