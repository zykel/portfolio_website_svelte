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

	const arrowWidth = 12;
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
			fill={expanded[id] ? '#5f5b83' : 'lightgray'}
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
	}

	.process-arrow {
		background-color: #f2f2f2; /* Adjust the background color as needed */
		/* padding: 10px; */
		/* border: 1px solid #ccc; */
		text-align: end; /* Center the text */
	}

	.process-text {
		background-color: #f2f2f2; /* Adjust the background color as needed */
		padding: 10px; /* Adjust the padding as needed */
		/* border: 1px solid #ccc */
		text-align: start; /* Center the text */
	}

	.process-title {
		font-size: 1rem;
		background-color: none;
		border: none;
		padding: 8px 0;
		cursor: pointer;
		text-align: start;
		margin: none;
		display: flex;
		align-items: center;
	}

	.process-description {
		max-height: 0;
		overflow: hidden;
		padding-bottom: 0;
		/* transition: max-height 0.3s ease-out; */ /* Not animating with fit-content */
	}

	.process-description.expanded {
		padding-bottom: 8px;
		max-height: fit-content; /* Adjust the max-height as needed */
	}

	.bold {
		font-weight: bold;
	}
</style>
