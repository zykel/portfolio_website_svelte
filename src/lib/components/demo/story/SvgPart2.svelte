<script>
	let { dataTweened, width, height } = $props();
</script>

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

<style>
	svg {
		background-color: #d1e6c3;
	}
</style>
