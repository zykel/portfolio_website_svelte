<script>
	let {
		x,
		y,
		widthArrow = 20,
		heightArrow = 20,
		placement,
		text,
		width = 100,
		height = 100,
		baseline = 'bottom'
	} = $props();

	const marginArrow = 5;
	const markerHeight = 4;

	const xPlacementFactor = $derived(placement.includes('right') ? 1 : -1);
	const yPlacementFactor = $derived(placement.includes('top') ? 1 : -1);

	// Define the start and end points of the arrow
	const startX = $derived(x + xPlacementFactor * widthArrow);
	const startY = $derived(y - yPlacementFactor * (heightArrow + marginArrow + markerHeight * 2));
	const endX = $derived(x);
	const endY = $derived(y - yPlacementFactor * (marginArrow + markerHeight * 2));

	// Define the control points for the Bezier curve
	const controlX1 = $derived(startX - xPlacementFactor * widthArrow * 1);
	const controlY1 = $derived(startY);
	const controlX2 = $derived(endX);
	const controlY2 = $derived(endY - yPlacementFactor * heightArrow * 1);
</script>

<defs>
	<marker id="arrowhead" markerWidth="5" markerHeight="4" refX="0" refY="2" orient="auto">
		<polygon points="0 0, 5 2, 0 4" />
	</marker>
</defs>

<path
	d={`M${startX},${startY} C${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`}
	stroke="black"
	fill="transparent"
	stroke-width="2"
	marker-end="url(#arrowhead)"
/>

{#if text}
	<foreignObject
		x={x + xPlacementFactor * (widthArrow + marginArrow) - (xPlacementFactor === -1 ? width : 0)}
		y={baseline === 'top' ? startY - height * 0.2 : startY + height * 0.2 - height}
		{width}
		{height}
	>
		<div class="annotation-text-container label-small placement-{placement}">
			{text}
		</div>
	</foreignObject>
{/if}

<style>
	.annotation-text-container {
		display: flex;
		width: 100%;
		height: 100%;
		font-weight: 600;
		color: #333333;
		/* background-color: rgb(59, 156, 72); */
	}
	.placement-topright {
		justify-content: flex-start;
		align-items: flex-end;
	}
</style>
