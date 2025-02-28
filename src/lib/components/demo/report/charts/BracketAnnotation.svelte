<script>
	let {
		topleft = { x: 0, y: 0 },
		topright = { x: 10, y: 0 },
		bottomright = { x: 10, y: 10 },
		bottomleft = { x: 0, y: 10 },
		directionOpen = 'left',
		text = '',
		height = 100,
		width = 100
	} = $props();

	const xText = $derived(Math.max(topleft.x, topright.x, bottomright.x, bottomleft.x) + 10);
</script>

<g class="bracket-annotation">
	<path
		d="
            M {topleft.x},{topleft.y}
            L {topright.x},{topright.y}
            L {bottomright.x},{bottomright.y}
            L {bottomleft.x},{bottomleft.y}
        "
		fill="none"
		stroke="#333333"
		stroke-width="2"
	/>

	{#if text}
		<foreignObject x={xText} y={(topleft.y + bottomleft.y) / 2 - height / 2} {width} {height}>
			<div class="annotation-text-container label-small">
				{text}
			</div>
		</foreignObject>
		<!-- <text x={xText} y={(topleft.y + bottomleft.y) / 2} dominant-baseline="middle" fill="black">
			{text}
		</text> -->
	{/if}
</g>

<style>
	.annotation-text-container {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		height: 100%;
		font-weight: 600;
		color: #333333;
	}
</style>
