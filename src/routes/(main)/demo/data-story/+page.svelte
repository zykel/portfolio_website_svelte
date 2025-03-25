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

	let width = $state(0);
	let height = $state(0);

	const margin = { top: 20, right: 20, bottom: 20, left: 20 };

	let stepNrPart1 = $state(0);
	let stepNrPart2 = $state(0);

	const xScale = $derived(scaleBand());

	const yScale = $derived(scaleLinear());

	const dataTweened = $derived([]);

	let categorySelected = $state('');

	const dataStepTextPart1_1 = $derived([
		{ id: 'intro', text: 'At Pizza Bianca, we offer four types of pizzas.', type: '' },
		{ id: 'reveal_supreme', text: 'We offer nine "Supreme" pizzas...', type: '' },
		{ id: 'reveal_veggie', text: '...nine "Veggie" pizzas...', type: '' },
		{ id: 'reveal_classic', text: '...eight "Classic" pizzas...', type: '' },
		{ id: 'reveal_chicken', text: '...and six "Chicken" pizzas.', type: '' },
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
			id: 'allow_pizza_bubbles_interaction',
			text: 'You may explore the pizzas based on their price and popularity.',
			type: 'interaction-instructions'
		}
	]);

	const dataStepTextPart2 = $derived([
		{
			id: 'plan_visit_start',
			text: `To plan your visit, this view shows you when our restaurant is busiest.`,
			type: ''
		},
		{
			id: 'most_busy_noon',
			text: `Most visitors stop by around noon between 11:30 and 14:00...`,
			type: ''
		},
		{
			id: 'most_busy_evening',
			text: `...and between 17:00 and 20:00 in the evening.`,
			type: ''
		},
		{
			id: 'visiting_hours_interaction',
			text: `Feel free to explore our visiting hours by moving over the chart. And see you soon at PIZZA BIANCA!`,
			type: 'interaction-instructions'
		}
	]);

	const allStepTextsPart1 = $derived([...dataStepTextPart1_1, ...dataStepTextPart1_2]);

	const getIdFromStepNrPart1 = (/** @type {number} */ stepNrPart1) =>
		allStepTextsPart1[stepNrPart1]?.id;
	const getStepNrFromIdPart1 = (/** @type {string} */ id) =>
		allStepTextsPart1.findIndex((/** @type {{ id: string; }} */ d) => d.id === id);

	const getStepNrFromIdPart2 = (/** @type {string} */ id) =>
		dataStepTextPart2.findIndex((/** @type {{ id: string; }} */ d) => d.id === id);

	setContext('getIdFromStepNrPart1', getIdFromStepNrPart1);
	setContext('getStepNrFromIdPart1', getStepNrFromIdPart1);
	setContext('getStepNrFromIdPart2', getStepNrFromIdPart2);
</script>

<div class="part-container">
	<div
		class="svg-div {allStepTextsPart1[stepNrPart1]?.type === 'interaction-instructions'
			? 'indicate-interaction'
			: ''}"
		bind:clientWidth={width}
		bind:clientHeight={height}
	>
		{#if width > 0 && height > 0}
			<SvgPart1 data={dataPizzas} {width} {height} stepNr={stepNrPart1} bind:categorySelected />
		{/if}
	</div>
	<div class="steps">
		<Scrolly bind:value={stepNrPart1}>
			{#each dataStepTextPart1_1 as { id, text, type }, i}
				<div
					class="step {i === dataStepTextPart1_1.length - 1 ? 'last-step' : ''}"
					class:active={stepNrPart1 === i}
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
					class:active={stepNrPart1 === stepNrThis}
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

<!-- {#if stepNrPart1 >= getStepNrFromIdPart1('allow_pizza_bubbles_interaction')} -->
{#if categorySelected !== ''}
	<div class="part-container">
		<div
			class="svg-div {dataStepTextPart2[stepNrPart2]?.type === 'interaction-instructions'
				? 'indicate-interaction'
				: ''}"
			bind:clientWidth={width}
			bind:clientHeight={height}
		>
			{#if width > 0 && height > 0}
				<SvgPart2 data={dataTime} {width} {height} stepNr={stepNrPart2} />
			{/if}
		</div>
		<div class="steps">
			<Scrolly bind:value={stepNrPart2}>
				{#each dataStepTextPart2 as { id, text, type }, i}
					<div
						class="step {i === dataStepTextPart2.length - 1
							? 'last-step'
							: ''} {categorySelected === '' ? 'hidden' : ''}"
						class:active={stepNrPart2 === i}
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
{/if}

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: hsla(35, 55%, 93%);
		background-color: hsl(35, 85%, 95%);
		/* background-color: hsla(249, 77%, 95%, 0.522); */
		overflow-x: hidden;
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
		height: 80svh;
		top: 10vh;
		top: 10svh;
		margin-top: 10vh;
		margin-top: 10svh;
		transition: box-shadow 0.3s ease-in-out;
		border-radius: 2rem;
		overflow: hidden;
		background-color: white;
		z-index: 0;
	}
	.indicate-interaction {
		/* box-shadow: inset 0 0 1rem hsla(249, 77%, 75%, 0.4); */
		box-shadow: inset 0 0 1rem rgba(0, 0, 0, 0.3);
	}

	.step {
		height: 40vh;
		height: 40svh;
		margin: 0 0 70vh 0;
		margin: 0 0 70svh 0;
		padding: 1vh;
		padding: 1svh;
		/* background-color: rgba(201, 144, 144, 0.411); */
		display: flex;
		justify-content: center;
		place-items: center;
		color: gray;
		font-size: 1.5rem;
	}
	.last-step {
		margin-bottom: 75vh;
		margin-bottom: 75svh;
	}
	.hidden {
		display: none;
	}

	.step-p {
		width: calc(min(300px, 80vw));
		padding: 1rem;
		background-color: rgb(253, 244, 231);
		background-color: hsl(35deg 63.61% 68.44%);
		border-radius: 1rem;
		text-align: center;
		box-shadow: 0 0 7px hsl(35deg 20.43% 46.48% / 53%);
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
