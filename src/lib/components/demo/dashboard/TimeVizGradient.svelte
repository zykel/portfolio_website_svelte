<script>
	let { yScale, height } = $props();
</script>

<defs>
	<linearGradient
		id="gradient-line-color"
		gradientUnits="userSpaceOnUse"
		x1="0"
		y1="{(100 * yScale.range()[0]) / height}%"
		x2="0"
		y2="{(100 * yScale.range()[1]) / height}%"
	>
		<stop offset="0%" stop-color="hsl(211, 49%, 82%)" />
		<stop offset="100%" stop-color="hsl(289, 28%, 69%)" />
	</linearGradient>
	<linearGradient
		id="gradient-line-desaturated"
		gradientUnits="userSpaceOnUse"
		x1="0"
		y1="{(100 * yScale.range()[0]) / height}%"
		x2="0"
		y2="{(100 * yScale.range()[1]) / height}%"
	>
		<stop offset="0%" stop-color="hsl(211, 0%, 82%)" />
		<stop offset="100%" stop-color="hsl(289, 0%, 69%)" />
	</linearGradient>
</defs>
