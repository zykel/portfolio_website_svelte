<script>
	import { get } from 'svelte/store';

	let { xScale, yScale } = $props();

	const handleWidth = 25;
	const rectStrokeWidth = 1;

	let pointerdownHandleLeft = $state(false);
	let pointerdownHandleRight = $state(false);

	const xMin = $derived(xScale(xScale.domain()[0]));
	const xMax = $derived(xScale(xScale.domain()[xScale.domain().length - 1]) + xScale.bandwidth());

	let xLeft = $state(xMin);
	let xRight = $state(xMax);

	const getSnappedValue = (/** @type {number} */ val) => {
		// Make the value snap between the bins of xScale
		const xMin = xScale.range()[0];
		const step = xScale.bandwidth();

		return Math.round((val - xMin) / step) * step + xMin;
	};

	const xLeftSnapped = $derived(getSnappedValue(xLeft));
	const xRightSnapped = $derived(getSnappedValue(xRight));
</script>

<svelte:window
	onpointermove={(event) => {
		if (pointerdownHandleLeft) {
			xLeft += event.movementX;
			xLeft = Math.max(xMin, Math.min(xLeft, xRight));
		}
		if (pointerdownHandleRight) {
			xRight += event.movementX;
			xRight = Math.max(xLeft, Math.min(xRight, xMax));
		}
	}}
	onpointerup={() => {
		pointerdownHandleLeft = false;
		pointerdownHandleRight = false;
	}}
/>

{#if yScale.range()[0] > yScale.range()[1]}
	<rect
		class="time-viz-brush"
		x={xLeftSnapped}
		y={yScale.range()[1]}
		width={xRightSnapped - xLeftSnapped}
		height={yScale.range()[0] - yScale.range()[1]}
		fill="rgba(0, 0, 0, 0.075)"
	/>
	<line
		class="time-viz-brush-line-handle-left"
		x1={xLeftSnapped}
		y1={yScale.range()[1]}
		x2={xLeftSnapped}
		y2={yScale.range()[0]}
		stroke="black"
		stroke-width={rectStrokeWidth}
	/>
	<line
		class="time-viz-brush-line-handle-right"
		x1={xRightSnapped}
		y1={yScale.range()[1]}
		x2={xRightSnapped}
		y2={yScale.range()[0]}
		stroke="black"
		stroke-width={rectStrokeWidth}
	/>
	<rect
		class="time-viz-brush-move-handle-left"
		onpointerdown={() => (pointerdownHandleLeft = true)}
		x={xLeftSnapped - handleWidth / 2}
		y={yScale.range()[1] - rectStrokeWidth}
		width={handleWidth}
		height={yScale.range()[0] - yScale.range()[1] + rectStrokeWidth * 2}
		fill="rgba(0,0,0,0)"
		cursor="ew-resize"
	/>
	<rect
		class="time-viz-brush-move-handle-right"
		onpointerdown={() => (pointerdownHandleRight = true)}
		x={xRightSnapped - handleWidth / 2}
		y={yScale.range()[1] - rectStrokeWidth}
		width={handleWidth}
		height={yScale.range()[0] - yScale.range()[1] + rectStrokeWidth * 2}
		fill="rgba(0,0,0,0)"
		cursor="ew-resize"
	/>
{/if}
