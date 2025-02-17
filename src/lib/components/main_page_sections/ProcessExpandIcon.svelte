<script>
	let { expanded } = $props();
</script>

<svg viewBox="0 0 10 10" class="expand-icon">
	<path
		class="expand-path"
		fill="none"
		stroke-width="1"
		d={!expanded ? 'M 0 4 L 5 7 L 10 4' : 'M 0 6 L 5 3 L 10 6'}
	/>
</svg>

<style>
	.expand-icon {
		height: 1rem;
		margin-left: 0.75rem;
	}

	.expand-path {
		stroke: #9c9c9c;
	}
</style>
