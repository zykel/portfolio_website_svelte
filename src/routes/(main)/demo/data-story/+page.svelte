<script>
	import { scaleBand, scaleLinear } from 'd3-scale';
	import { max } from 'd3-array';
	import { Tween } from 'svelte/motion';
	import Scrolly from '$lib/components/demo/story/Scrolly.svelte';

	let { data } = $props();

	$inspect(data);

	let width = $state(0);
	let height = $state(0);

	const margin = { top: 20, right: 20, bottom: 20, left: 20 };

	const dataStepped = $derived([0, 1, 2]);

	$inspect(dataStepped);

	let stepNr = $state(0);

	const xScale = $derived(scaleBand());

	const yScale = $derived(scaleLinear());

	const dataTweened = $derived([]);

	$effect(() => {
		dataTweened.forEach((d, i) => {
			d.y.target = i <= stepNr ? yScale(d.score) : 0;
			d.height.target = i <= stepNr ? height - yScale(d.score) - margin.bottom : 0;
		});
	});
</script>

<div class="main-div">
	<div class="svg-div" bind:clientWidth={width} bind:clientHeight={height}>
		{#if width > 0 && height > 0}
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">
				{#each dataTweened as datum, i}
					<rect
						x={datum.x}
						y={datum.y.current}
						width={datum.width}
						height={datum.height.current}
						fill="steelblue"
					/>
				{/each}
			</svg>
		{/if}
	</div>
	<div class="steps">
		<Scrolly bind:value={stepNr}>
			{#each dataStepped as _, i}
				<div class="step" class:active={stepNr === i}>
					<p>Hi there</p>
				</div>
			{/each}
		</Scrolly>
	</div>
</div>

<div class="main-div">
	<div class="svg-div" bind:clientWidth={width} bind:clientHeight={height}>
		{#if width > 0 && height > 0}
			<svg class="svgtwo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">
				{#each dataTweened as datum, i}
					<rect
						x={datum.x}
						y={datum.y.current}
						width={datum.width}
						height={datum.height.current}
						fill="steelblue"
					/>
				{/each}
			</svg>
		{/if}
	</div>
	<div class="steps">
		<Scrolly bind:value={stepNr}>
			{#each dataStepped as _, i}
				<div class="step" class:active={stepNr === i}>
					<p>Hi there</p>
				</div>
			{/each}
		</Scrolly>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	.main-div {
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

	svg {
		background-color: #f0f0f0;
	}
	.svgtwo {
		background-color: rgb(195, 249, 231);
	}

	.step {
		height: 40vh;
		margin: 30vh 0;
		background-color: aquamarine;
		display: flex;
		justify-content: center;
		place-items: center;
	}

	.step.active {
		background-color: tomato;
	}

	.steps {
		position: relative;
		z-index: 2;
		pointer-events: none;
	}
</style>
