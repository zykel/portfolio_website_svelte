<script>
	let { x, y, placement, text, width = 100, height = 100 } = $props();

	const widthArrow = 20;
	const heightArrow = 20;
	const marginArrow = 5;
	const markerHeight = 4;

	// Define the start and end points of the arrow
	const startX = $derived(x + widthArrow);
	const startY = $derived(y - heightArrow - marginArrow - markerHeight * 2);
	const endX = $derived(x);
	const endY = $derived(y - marginArrow - markerHeight * 2);

	// Define the control points for the Bezier curve
	const controlX1 = $derived(startX - widthArrow * 0.75);
	const controlY1 = $derived(startY);
	const controlX2 = $derived(endX);
	const controlY2 = $derived(endY - heightArrow * 0.75);
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
	<foreignObject x={x + widthArrow + marginArrow} y={y - heightArrow - height} {width} {height}>
		<div class="annotation-text-container label-small">
			{text}
		</div>
	</foreignObject>
{/if}

<style>
	.annotation-text-container {
		display: flex;
		justify-content: flex-start;
		align-items: flex-end;
		width: 100%;
		height: 100%;
		font-weight: 600;
		color: #333333;
		/* background-color: rgb(59, 156, 72); */
	}
</style>
