<script>
	import { getContext } from 'svelte';
	import { max, rollups, sum } from 'd3-array';
	import { scaleLinear, scaleBand } from 'd3-scale';

	/**
	 * @typedef {Object.<string, string> & { date?: Date } & { month?: number }} DataEntry
	 */

	let { width, height } = $props();

	// $inspect({ width, height });

	const data = getContext('data');
	const timeUnit = $derived(getContext('selected').timeUnit);
	const selected = getContext('selected');

	/**
	 * @param {Record<string, string>[]} data
	 * @param {string} timeUnit
	 */
	const getTimeVizData = (data, timeUnit) => {
		let binnedDataNamed = [];

		if (timeUnit === 'day of week') {
			// Bin data, first by selected.type, then by day of week
			const binnedData = rollups(
				data,
				(/** @type {DataEntry}*/ v) =>
					sum(v, (/** @type {{ quantity: string | number; }} */ d) => +d.quantity),
				(/** @type {DataEntry}*/ d) => d[selected.type],
				(/** @type {DataEntry}*/ d) => d.day
			);
			binnedDataNamed = binnedData.map(
				(/** @type {[string, Array<[string, number]>]} */ itemInfo) => {
					const [name, records] = itemInfo;
					const recordsNamed = records.map((/** @type {[string, number]} */ recordInfo) => {
						const [unit, count] = recordInfo;
						return { unit, count };
					});
					return { name, records: recordsNamed };
				}
			);
			console.log(binnedDataNamed);
		} else if (timeUnit === 'hour of day') {
			// Do something else
		} else if (timeUnit === 'month of year') {
			// Do something else
		}

		return binnedDataNamed;
	};

	const timeVizData = $derived(getTimeVizData(data, timeUnit));

	const xScale = $derived(
		scaleBand()
			.domain(timeUnit === 'day of week' ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] : [])
			.range([0, width])
	);
	// $effect(() => {
	// 	xScale
	// });

	const yScale = $derived(
		scaleLinear()
			.domain([
				0,
				max(timeVizData, (/** @type {{ records: any; }} */ d) =>
					max(d.records, (/** @type {{ count: any; }} */ e) => e.count)
				)
			])
			.range([height, 0])
	);

	$inspect({
		domx: xScale.domain(),
		ranx: xScale.range(),
		domy: yScale.domain(),
		rany: yScale.range()
	});

	$inspect(timeVizData);
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">
	{#each timeVizData as datum}
		<g>
			{#each datum.records as { unit, count }}
				<rect
					x={xScale(unit)}
					y={yScale(count)}
					width={xScale.bandwidth()}
					height={height - yScale(count)}
					fill="steelblue"
					opacity={1 / 32}
				/>
			{/each}
		</g>
	{/each}
	<circle cx="0" cy="0" r="20" stroke="black" stroke-width="3" fill="red" />
	<circle cx={width} cy={height} r="20" stroke="black" stroke-width="3" fill="red" />
</svg>

<style>
	svg {
		width: 100%;
		height: 100%;
		/* display: block; */
		/* background-color: aquamarine; */
	}

	.svg-container {
	}
</style>
