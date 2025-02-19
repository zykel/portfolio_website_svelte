<script>
	import { line } from 'd3-shape';

	let { item, xScale, yScale } = $props();

	const lineGenerator = line()
		.x((/** @type {{ unit: any; }} */ d) => xScale(d.unit) + xScale.bandwidth() / 2)
		.y((/** @type {{ count: any; }} */ d) => yScale(d.count));
</script>

<path
	d={lineGenerator(item.records)}
	fill="none"
	stroke="steelblue"
	stroke-width="2"
	opacity={1 / 3}
/>
