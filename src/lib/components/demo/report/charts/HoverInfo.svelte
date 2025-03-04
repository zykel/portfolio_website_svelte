<script>
	import { getContext } from 'svelte';
	/**
	 * @typedef {Object} InfoTextItem
	 * @property {string} title - The title of the info text item
	 * @property {string|number} value - The value of the info text item
	 */

	let xCurr = $state(0);
	let yCurr = $state(0);
	let display = $state('none');
	/** @type {InfoTextItem[]} */
	let infoTextArray = $state([]);

	/**
	 * Function that processes an object with properties 'x' and 'y'.
	 *
	 * @param {Object} param - The object containing the properties
	 * @param {PointerEvent} param.event - A pointer event
	 * @param {InfoTextItem[]} param.infoText - The text to display
	 *
	 * @returns {void}
	 */
	getContext('showHoverInfo').value = ({ event, infoText }) => {
		display = 'block';
		xCurr = event.pageX;
		yCurr = event.pageY;
		infoTextArray = infoText;
	};
	getContext('hideHoverInfo').value = () => {
		display = 'none';
	};
</script>

<div class="hover-info legend" style:left="{xCurr}px" style:top="{yCurr - 20}px" style:display>
	{#each infoTextArray as { title, value }}
		<p class="hover-info-text"><span class="hover-info-title">{@html title}</span> {@html value}</p>
	{/each}
</div>

<style>
	.hover-info {
		position: absolute;
		transform: translate(-50%, -100%);
		background-color: white;
		/* border: 1px solid black; */
		border-radius: 0.5rem;
		padding: 0.5rem 1rem;
		pointer-events: none;
		font-size: small;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
	}

	.hover-info::after {
		content: '';
		position: absolute;
		top: 99%; /* Adjust this value to position the triangle */
		left: 50%;
		transform: translate(-50%, 0%);
		width: 0;
		height: 0;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-top: 20px solid white;
	}

	.hover-info-text {
		margin: 0;
	}
	.hover-info-title {
		font-weight: bold;
	}
</style>
