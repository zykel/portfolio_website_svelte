<script>
	let {
		x,
		y,
		width,
		height,
		transform,
		opacity = 1,
		colorMain = '#000',
		colorSauce = '#fff',
		onpointerdown = () => {},
		onpointerover = () => {},
		cursor = 'default'
	} = $props();
</script>

<g {transform}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		{x}
		{y}
		{width}
		{height}
		{opacity}
		{onpointerdown}
		{onpointerover}
		{cursor}
		viewBox="0 0 100 100"
	>
		<g transform="translate(-201.667 -154.48) scale(3.46785)">
			<circle
				cx="72.571"
				cy="58.964"
				r="13.418"
				style="fill:{colorSauce};fill-opacity:1;stroke:{colorMain};stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers;stop-color:{colorMain}"
			/>
			<circle
				cx="81.16"
				cy="58.148"
				r="2.173"
				style="fill:{colorMain};fill-opacity:1;stroke:none;stroke-width:2.00001;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers;stop-color:{colorMain}"
			/>
			<path
				d="M72.781 55.145c-.633-.682-1.266-1.364-1.435-2.264-.168-.9.128-2.017.424-3.135M68.635 66.702c.91-.196 1.82-.391 2.679-.076.86.315 1.669 1.141 2.478 1.967M61.843 61.518c.056-.929.111-1.857.646-2.6.534-.744 1.547-1.302 2.56-1.86M75.257 58.066c-.652.663-1.305 1.326-2.196 1.535-.892.209-2.022-.037-3.151-.283"
				style="fill:none;stroke:{colorMain};stroke-width:1;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
			/>
			<circle
				cx="77.234"
				cy="64.818"
				r="2.173"
				style="fill:{colorMain};fill-opacity:1;stroke:none;stroke-width:2.00001;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers;stop-color:{colorMain}"
			/>
			<circle
				cx="66.146"
				cy="62.461"
				r="2.173"
				style="fill:{colorMain};fill-opacity:1;stroke:none;stroke-width:2.00001;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers;stop-color:{colorMain}"
			/>
			<circle
				cx="77.296"
				cy="51.877"
				r="2.173"
				style="fill:{colorMain};fill-opacity:1;stroke:none;stroke-width:2.00001;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers;stop-color:{colorMain}"
			/>
			<circle
				cx="66.826"
				cy="53.386"
				r="2.173"
				style="fill:{colorMain};fill-opacity:1;stroke:none;stroke-width:2.00001;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke fill markers;stop-color:{colorMain}"
			/>
		</g>
	</svg>
</g>
