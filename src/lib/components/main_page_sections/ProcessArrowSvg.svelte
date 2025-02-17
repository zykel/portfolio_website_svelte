<script>
	let { width, height, fill, type = 'main' } = $props();

	const arrowWidth = $derived(width);
	const yDepth = $derived(arrowWidth * 0.33);
	const x = (/** @type {number} */ val) => width - arrowWidth + val;

	const getPathString = () => {
		// https://svg-tutorial.com/svg/arc/
		if (type === 'first') {
			return `M${x(0)} ${arrowWidth / 2} 
            A${arrowWidth / 2} ${arrowWidth / 2} 0 1 1 ${x(arrowWidth)} ${arrowWidth / 2} 
            V${height - yDepth} L${x(arrowWidth / 2)} ${height} L${x(0)} ${height - yDepth}Z`;
		}
		if (type === 'main') {
			return `M${x(0)} 0 L${x(arrowWidth / 2)} ${yDepth} L${x(arrowWidth)} 0 V${height - yDepth} L${x(
				arrowWidth / 2
			)} ${height} L${x(0)} ${height - yDepth} Z`;
		}
		if (type === 'last') {
			return `M${x(0)} 0 L${x(arrowWidth / 2)} ${yDepth} L${x(arrowWidth)} 0 V${height - arrowWidth / 2} 
            A${arrowWidth / 2} ${arrowWidth / 2} 0 1 1 ${x(0)} ${height - arrowWidth / 2}Z`;
		}

		return '';
	};
</script>

<svg class="main-arrow-svg" xmlns="http://www.w3.org/2000/svg" {height} {width}>
	<path class="arrow-path" d={getPathString()} {fill} />
</svg>

<style>
	.main-arrow-svg {
		/* height: 100%;
        width: auto; */
		/* background-color: aquamarine; */
	}
</style>
