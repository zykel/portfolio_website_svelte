<script>
	import TimeViz from '$lib/components/demo/dashboard/TimeViz.svelte';

	// You can add any necessary script here

	const extents = $state({
		timeVizHeight: 0,
		timeVizWidth: 0
	});
</script>

<div class="main-area">
	<div class="left-part">
		<div class="section">
			<div class="dashboard__section-title-container">
				<h2>Sales over time</h2>
			</div>
			<div
				class="svg-container"
				bind:clientHeight={extents.timeVizHeight}
				bind:clientWidth={extents.timeVizWidth}
			>
				<TimeViz width={extents.timeVizWidth} height={extents.timeVizHeight} />
			</div>
		</div>
		<div class="section">
			<div class="dashboard__section-title-container">
				<h2>Bottom Left</h2>
			</div>
			<div class="dashboard__section-content">
				<p>Content for the bottom left part...</p>
			</div>
		</div>
	</div>
	<div class="right-part section">
		<div class="dashboard__section-title-container">
			<h2>Right Part</h2>
		</div>
		<div class="dashboard__section-content">
			<p>Content for the bottom left part...</p>
		</div>
	</div>
</div>

<style>
	.main-area {
		display: grid;
		grid-template-columns: 3fr 1fr; /* Two equal columns */
		grid-gap: 20px; /* Gap between columns */
		padding: 20px; /* Padding around the main area */
		background-color: #ecf0f1; /* Main area background color */
		box-sizing: border-box; /* Include padding in the element's total width and height */
		min-height: 0;
		height: 100vh;
		height: 100svh;
	}

	.left-part {
		display: grid;
		grid-template-rows: 1fr 3fr; /* Two equal rows */
		grid-gap: 20px;
		min-height: 0;
	}

	.section {
		background-color: white; /* Section background color */
		padding: 20px;
		border-radius: 10px; /* Rounded corners */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional: Add a subtle shadow */
		display: grid;
		grid-template-rows: auto 1fr;
		height: 100%;
		min-height: 0;
		box-sizing: border-box;
	}

	.right-part {
		background-color: white; /* Section background color */
		padding: 20px;
		border-radius: 10px; /* Rounded corners */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional: Add a subtle shadow */
		min-height: 0;
	}

	.dashboard__section-title-container {
		min-height: 0;
	}
	.dashboard__section-content {
		min-height: 0;
		position: relative;
	}

	.svg-container {
		min-height: 0;
		position: relative;
		height: 100%;
	}

	h2 {
		margin: 0;
	}
</style>
