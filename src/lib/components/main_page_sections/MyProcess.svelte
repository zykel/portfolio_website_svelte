<script>
	import ProcessArrowSvg from './ProcessArrowSvg.svelte';
	import ProcessExpandIcon from './ProcessExpandIcon.svelte';

	const toggleDescription = (/** @type {{ target: { nextElementSibling: any; }; }} */ event) => {
		const description = event.target.nextElementSibling;
		description.classList.toggle('expanded');
	};

	const expanded = $state({
		goals: false,
		data: false,
		design: false,
		solution: false
	});

	const heightsTitle = $state({
		goals: 0,
		data: 0,
		design: 0,
		solution: 0
	});

	const heightsDescription = $state({
		goals: 0,
		data: 0,
		design: 0,
		solution: 0
	});
	$inspect(heightsTitle.data);

	const arrowWidth = 15;
</script>

{#snippet processEntry(
	/** @type {"goals" | "data" | "design" | "solution"} */ id,
	/** @type {String} */ title1,
	/** @type {String} */ title2,
	/** @type {String} */ description
)}
	<div class="process-grid-item process-arrow">
		<ProcessArrowSvg
			height={heightsTitle[id] + 20 + (expanded[id] ? heightsDescription[id] : 0)}
			width={arrowWidth}
			fill={expanded[id] ? '#5f5b83' : 'hsl(0, 0%, 70%)'}
		/>
	</div>
	<div class="process-grid-item process-text">
		<button
			class="process-title"
			onclick={() => (expanded[id] = !expanded[id])}
			bind:clientHeight={heightsTitle[id]}
		>
			<span>{title1} <span class="bold">{title2}</span> </span>
			<ProcessExpandIcon expanded={expanded[id]} />
		</button>
		<div
			class="process-description"
			class:expanded={expanded[id]}
			bind:clientHeight={heightsDescription[id]}
		>
			{description}
		</div>
	</div>
{/snippet}

<h2>MY PROCESS</h2>
<!-- <hr style:margin-bottom="1rem" style:border-top="1px solid #ccc" /> -->

<div class="process-grid" style:grid-template-columns="{arrowWidth}px auto">
	<div class="process-grid-item process-arrow">
		<ProcessArrowSvg height={20} width={arrowWidth} fill="#e4e4e4" type="first" />
	</div>
	<div class="process-grid-item process-empty"></div>
	<!-- <div class="process-grid-item process-arrow">V</div>
	<div class="process-grid-item process-text">
		<div class="process-title">DETERMINE <span class="bold">GOALS</span></div>
	</div> -->
	{@render processEntry(
		'goals',
		'DETERMINE',
		'GOALS',
		'I determine the goals of the project to ensure that the solution is aligned with the objectives.'
	)}
	{@render processEntry(
		'data',
		'ASSESS',
		'DATA',
		'Data is the foundation of any project. I assess the data to understand the context and the possibilities.'
	)}
	{@render processEntry(
		'design',
		'DEVELOP',
		'DESIGN',
		'I develop the design of the solution to ensure that it is user-friendly and visually appealing.'
	)}
	{@render processEntry(
		'solution',
		'IMPLEMENT',
		'SOLUTION',
		'I implement the solution to bring the project to life and achieve the desired outcomes.'
	)}
	<div class="process-grid-item process-arrow">
		<ProcessArrowSvg height={20} width={arrowWidth} fill="#ffd8af" type="last" />
	</div>
	<div class="process-grid-item process-empty"></div>
</div>

<style>
	.process-grid {
		display: grid;
		grid-template-rows: repeat(6, auto);
		gap: 0px; /* Adjust the gap between grid items as needed */
		padding: 0 0rem;
	}

	.process-arrow {
		/* padding: 10px; */
		/* border: 1px solid #ccc; */
		text-align: end; /* Center the text */
		z-index: 1;
	}

	.process-text {
		padding: 10px 0px; /* Adjust the padding as needed */
		/* border: 1px solid #ccc */
		text-align: start; /* Center the text */
	}

	.process-title {
		font-size: 1rem;
		background-color: hsla(0, 0%, 92%, 0.8);
		border: none;
		/* border-top: lightgray 1px solid; */
		/* border-radius: 5px; */
		padding: 8px 10px;
		cursor: pointer;
		text-align: start;
		margin: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		/* background: rgba(235, 235, 235, 0.8); */
		/* backdrop-filter: blur(5px); */
		/* box-shadow: 0px 0px 4px 4px rgba(235, 235, 235, 0.8); */
		z-index: 0;
	}

	.process-description {
		max-height: 0;
		overflow: hidden;
		padding-top: 0;
		padding-bottom: 0;
		padding: 0 10px;
		/* transition: max-height 0.3s ease-out; */
		transition: padding 0.3s ease-out;
	}

	.process-description.expanded {
		padding-top: 8px;
		padding-bottom: 8px;
		max-height: fit-content; /* Adjust the max-height as needed */
	}

	.bold {
		font-weight: bold;
	}
</style>
