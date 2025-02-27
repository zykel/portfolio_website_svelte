<script>
	/**
	 * @typedef {Object.<string, string> & { date?: Date } & { month?: number }} DataEntry
	 */

	import { setContext } from 'svelte';
	import MainArea from '$lib/components/demo/dashboard/MainArea.svelte';
	import { valueof } from '@observablehq/plot';
	import { daysOfWeek, hoursOfDay, monthsOfYear } from '$lib/scripts/utilityDashboard.svelte.js';

	let { data } = $props();

	let csvData = data.csvData.map((d) => {
		// Parse order_date and order_time into javascript date, with order_date being formated as e.g. 24.08.2015 and order_time as e.g. 20:58:08
		const date = d.order_date.split('.');
		const time = d.order_time.split(':');
		d.date = new Date(+date[2], +date[1] - 1, +date[0], +time[0], +time[1], +time[2]);
		// Add day of week
		d.day = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][d.date.getDay()];
		// Add month of year
		d.month = d.date.getMonth();

		return d;
	});

	const timeUnits = ['hour of day', 'day of week', 'month of year'];
	const types = ['pizza_name', 'pizza_category'];
	const pizzaNames = [...new Set(csvData.map((d) => d.pizza_name))];
	const pizzaCategories = ['Classic', 'Veggie', 'Supreme', 'Chicken'];
	const selected = $state({
		timeUnit: timeUnits[0],
		type: types[1],
		pizzaNames: [...pizzaNames],
		pizzaCategories: [...pizzaCategories]
	});
	const focusedItems = $state({ value: /** @type {string[]} */ ([]) });

	/** @type {{value: null | string}} */
	let hoveredPizzaName = $state({ value: null });
	const updateHoveredPizzaName = (/** @type {string | null} */ name) => {
		hoveredPizzaName.value = name;
	};

	const getFullRange = () => {
		return selected.timeUnit === 'day of week'
			? daysOfWeek
			: selected.timeUnit === 'hour of day'
				? hoursOfDay
				: monthsOfYear;
	};
	/** @type {{idxLeft: number, idxRight: number}} */
	const timeFilterRange = $state({ idxLeft: 0, idxRight: getFullRange().length });

	const showAverage = $state({ value: false });

	const resetTimeFilterRange = () => {
		timeFilterRange.idxLeft = 0;
		timeFilterRange.idxRight = getFullRange().length;
	};

	const getFilteredData = () => {
		if (timeFilterRange.idxLeft === 0 && timeFilterRange.idxRight === getFullRange().length) {
			return data.csvData;
		}
		const fullRange = getFullRange();
		const accessCompareValue =
			selected.timeUnit === 'day of week'
				? (/** @type {DataEntry} */ d) => d.day
				: selected.timeUnit === 'hour of day'
					? (/** @type {DataEntry} */ d) => d.date?.getHours().toString().padStart(2, '0') + ':00'
					: (/** @type {DataEntry} */ d) =>
							monthsOfYear[typeof d.date !== 'undefined' ? d.date.getMonth() : 0];

		const filteredRange = fullRange.slice(timeFilterRange.idxLeft, timeFilterRange.idxRight);

		// return data.csvData;

		return data.csvData.filter((d) => filteredRange.includes(accessCompareValue(d)));
	};

	const dataFiltered = $state({ value: /** @type {DataEntry[]} */ (data.csvData) });

	$effect(() => {
		dataFiltered.value = getFilteredData();
	});

	setContext('data', dataFiltered);
	setContext('dataFiltered', data.csvData);
	setContext('timeUnits', timeUnits);
	setContext('types', types);
	setContext('pizzaNames', pizzaNames);
	setContext('pizzaCategories', pizzaCategories);
	setContext('selected', selected);
	setContext('focusedItems', focusedItems);
	setContext('timeFilterRange', timeFilterRange);
	setContext('resetTimeFilterRange', resetTimeFilterRange);
	setContext('showAverage', showAverage);
	setContext('hoveredPizzaName', hoveredPizzaName);
	setContext('updateHoveredPizzaName', updateHoveredPizzaName);
</script>

<div class="dashboard-container">
	<div class="sidebar">
		<h2>Sidebar</h2>
		<ul>
			<li><a href="#link1">Link 1</a></li>
			<li><a href="#link2">Link 2</a></li>
			<li><a href="#link3">Link 3</a></li>
			<li><a href="#link4">Link 4</a></li>
		</ul>
		<select id="type-selector" bind:value={selected.type}>
			{#each types as type}
				<option value={type}>{type}</option>
			{/each}
		</select>

		<!-- Radio button group -->
		<div>
			Show
			<!-- <label>
				<input type="radio" bind:group={showAverage.value} value={true} />
				average
			</label>
			<label>
				<input type="radio" bind:group={showAverage.value} value={false} />
				aggregate
			</label> -->
			<div class="select-wrapper">
				<select id="avg-aggregate-selector" bind:value={showAverage.value}>
					<option value={true}>average</option>
					<option value={false}>aggregate</option>
				</select>
			</div>
			across selected time range.
		</div>
	</div>
	<MainArea />
</div>

<!-- <script>
	// No JavaScript logic needed for basic layout
</script>

<div class="main-grid">
	<div class="upper-cell">
		<div class="inner-grid">
			<h2 class="title">Responsive SVG Demo</h2>
			<div class="svg-container">
				<svg viewBox="0 0 100 100">
					<circle cx="-200" cy="50" r="45" fill="salmon" />
					<rect x="10" y="10" width="80" height="80" fill="none" stroke="black" />
				</svg>
			</div>
		</div>
	</div>

	<div class="lower-cell">
	</div>
</div>

<style>
	/* Base styles */
	:global(body) {
		margin: 0;
		height: 100vh;
		overflow: hidden;
	}

	/* Main grid structure */
	.main-grid {
		display: grid;
		grid-template-rows: 1fr 3fr;
		height: 100vh;
		min-height: 0; /* Crucial for nested grids */
	}

	/* Upper cell containing nested grid */
	.upper-cell {
		min-height: 0; /* Allow shrinking below content size */
	}

	/* Inner grid for title + SVG */
	.inner-grid {
		display: grid;
		grid-template-rows: auto 1fr;
		height: 100%;
		min-height: 0;
	}

	.title {
		margin: 0;
		padding: 1rem;
		background: #f0f0f0;
	}

	.svg-container {
		min-height: 0;
		position: relative;
	}

	/* Responsive SVG styling */
	svg {
		width: 100%;
		height: 100%;
		display: block;
		background-color: aquamarine;
	}

	/* Lower cell styling */
	.lower-cell {
		background: #f8f8f8;
		min-height: 0;
	}
</!-->

<style>
	:global(body) {
		margin: 0;
		/* padding: 0; */
	}

	.dashboard-container {
		display: grid;
		grid-template-columns: 250px 1fr; /* Sidebar width and main area */
		height: 100vh; /* Full height of the viewport */
	}

	.sidebar {
		background-color: #2c3e50; /* Sidebar background color */
		color: white; /* Sidebar text color */
		padding: 20px;
	}

	.select-wrapper {
		position: relative;
		display: inline-block;
	}
	.select-wrapper::after {
		content: '▾'; /* Unicode character for downward arrow */
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none; /* Ensure the arrow does not block clicks */
		color: white; /* Arrow color */
	}
	select {
		appearance: none; /* Remove default styles */
		background: none; /* Remove default background */
		border: 1px solid white; /* Remove default border */
		border-radius: 10px;
		color: inherit; /* Inherit text color */
		font: inherit; /* Inherit font styles */
		padding: 0 1.5rem 0 0.5rem; /* Remove default padding */
		margin: 0; /* Remove default margin */
	}

	select option {
		color: black; /* Set the font color of the options to black */
	}
</style>
