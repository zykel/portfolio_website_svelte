<script>
	import { getContext } from 'svelte';

	// Adapted from here: https://svelte.dev/playground/7d674cc78a3a44beb2c5a9381c7eb1a9?version=5.20.4

	let { xScale, yScale, svgTimeViz } = $props();

	const timeFilterRange = getContext('timeFilterRange');

	const handleWidth = 12;
	const ghostHandleWidth = handleWidth * 2;
	const rectStrokeWidth = 1;
	const buttonWidth = 90;
	const buttonHeight = 30;
	const handleArrowWidth = 6;
	const handleArrowHeight = 10;

	let pointerdownHandleLeft = $state(false);
	let pointerdownHandleRight = $state(false);

	const xMin = $derived(xScale(xScale.domain()[0]));
	const xMax = $derived(xScale(xScale.domain()[xScale.domain().length - 1]) + xScale.bandwidth());

	let xLeft = $state(xMin);
	let xRight = $state(xMax);

	const bandwidth = $derived(xScale.bandwidth());

	const getIdx = (/** @type {number} */ val) => {
		return Math.round((val - xMin) / bandwidth);
	};

	const idxLeft = $derived(getIdx(xLeft));
	const idxRight = $derived(getIdx(xRight));

	const updateTimeFilterRange = () => {
		timeFilterRange.idxLeft = idxLeft;
		timeFilterRange.idxRight = idxRight;
	};

	const idxsDifferFromStoredIdxs = $derived(
		idxLeft !== timeFilterRange.idxLeft || idxRight !== timeFilterRange.idxRight
	);

	const xLeftSnapped = $derived(idxLeft * bandwidth + xMin);
	const xRightSnapped = $derived(idxRight * bandwidth + xMin);
</script>

<svelte:window
	onpointermove={(event) => {
		const xNew = event.clientX - svgTimeViz.getBoundingClientRect().left;
		if (pointerdownHandleLeft) {
			if (xNew >= xMin && xNew + bandwidth < xRight) {
				xLeft = xNew;
			}
		}
		if (pointerdownHandleRight) {
			if (xNew - bandwidth > xLeft && xNew <= xMax) {
				xRight = xNew;
			}
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
	<rect
		class="time-viz-brush-line-handle-left"
		x={xLeftSnapped - handleWidth / 2}
		y={yScale.range()[1]}
		width={handleWidth}
		height={yScale.range()[0] - yScale.range()[1]}
		fill="rgba(0, 0, 0, 0.1)"
		stroke="hsl(0, 0%, 10%)"
		stroke-width="1"
		rx={handleWidth / 2}
	/>
	<path
		class="arrow-handle-left-path"
		d={`M ${xLeftSnapped - handleArrowWidth / 2} ${(yScale.range()[0] + yScale.range()[1]) / 2 - handleArrowHeight / 2} l ${handleArrowWidth} ${handleArrowHeight / 2} l ${-handleArrowWidth} ${handleArrowHeight / 2} z`}
		fill="hsl(0, 0%, 10%)"
		stroke="hsl(0, 0%, 10%)"
		stroke-width="1"
	/>
	<rect
		class="time-viz-brush-line-handle-left"
		x={xRightSnapped - handleWidth / 2}
		y={yScale.range()[1]}
		width={handleWidth}
		height={yScale.range()[0] - yScale.range()[1]}
		fill="rgba(0, 0, 0, 0.1)"
		stroke="hsl(0, 0%, 10%)"
		stroke-width="1"
		rx={handleWidth / 2}
	/>
	<path
		class="arrow-handle-left-path"
		d={`M ${xRightSnapped + handleArrowWidth / 2} ${(yScale.range()[0] + yScale.range()[1]) / 2 - handleArrowHeight / 2} l ${-handleArrowWidth} ${handleArrowHeight / 2} l ${+handleArrowWidth} ${handleArrowHeight / 2} z`}
		fill="hsl(0, 0%, 10%)"
		stroke="hsl(0, 0%, 10%)"
		stroke-width="1"
	/>
	<rect
		class="time-viz-brush-move-handle-left"
		onpointerdown={() => (pointerdownHandleLeft = true)}
		x={xLeftSnapped - ghostHandleWidth / 2}
		y={yScale.range()[1] - rectStrokeWidth}
		width={ghostHandleWidth}
		height={yScale.range()[0] - yScale.range()[1] + rectStrokeWidth * 2}
		fill="rgba(0,0,0,0)"
		cursor="ew-resize"
	/>
	<rect
		class="time-viz-brush-move-handle-right"
		onpointerdown={() => (pointerdownHandleRight = true)}
		x={xRightSnapped - ghostHandleWidth / 2}
		y={yScale.range()[1] - rectStrokeWidth}
		width={ghostHandleWidth}
		height={yScale.range()[0] - yScale.range()[1] + rectStrokeWidth * 2}
		fill="rgba(0,0,0,0)"
		cursor="ew-resize"
	/>
	{#if idxsDifferFromStoredIdxs}
		<foreignObject
			x={(xLeftSnapped + xRightSnapped) / 2 - buttonWidth / 2 - 2}
			y={yScale.range()[1]}
			width={buttonWidth + 4}
			height={buttonHeight + 4}
		>
			<div class="time-viz-brush-apply-button-container">
				<button class="time-viz-brush-apply-button" onclick={() => updateTimeFilterRange()}>
					Apply Filter
				</button>
			</div>
		</foreignObject>
	{/if}
{/if}

<style>
	.time-viz-brush-apply-button-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
	}

	.time-viz-brush-apply-button {
		cursor: pointer;
		background-color: rgba(255, 255, 255, 0.5);
		border: 1px solid rgba(0, 0, 0, 0.5);
		border-radius: 15px;
		padding: 4px 8px;
		font-family: inherit;
		user-select: none;
	}

	.time-viz-brush-apply-button:hover {
		background-color: rgba(255, 255, 255, 0.75);
	}
</style>
