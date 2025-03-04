<script>
	import { interpolateHsl } from 'd3-interpolate';
	import { scaleLinear } from 'd3-scale';

	let { title, minVal, maxVal, minColor, maxColor } = $props();

	const widthGradient = 100;
	const heightGradient = 20;
</script>

<div class="continuous-color-legend limit-width">
	<div class="continuous-color-legend-title">{title}:</div>
	<div class="continuous-color-legend">
		{minVal}
		<div
			class="continuous-color-legend-gradient"
			style:background="linear-gradient(to right, {minColor}, {maxColor})"
		></div>
		{maxVal}
	</div>
</div>

<style>
	.continuous-color-legend {
		display: flex;
		flex-direction: row;
		gap: 10px;
		align-items: center;
		flex-wrap: wrap;
	}

	.continuous-color-legend-title {
		font-weight: bold;
	}

	.continuous-color-legend-gradient {
		width: 100px;
		height: 1rem;
		border-radius: 10px;
		border: 1px solid lightgray;
	}
</style>
