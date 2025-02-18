<script>
	let { width, height } = $props();

	$inspect({ width, height });
</script>

<!-- style="width: {width}px; height: {height}px;" -->
<!-- <div class="svg-container"> -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">
	<circle cx="0" cy="0" r="20" stroke="black" stroke-width="3" fill="red" />
	<circle cx={width} cy={height} r="20" stroke="black" stroke-width="3" fill="red" />
</svg>

<!-- </div> -->

<style>
	svg {
		width: 100%;
		height: 100%;
		display: block;
		background-color: aquamarine;
	}

	.svg-container {
	}
</style>
