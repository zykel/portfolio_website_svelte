<script>
	import * as m from '$lib/paraglide/messages.js';
	import ProcessArrowSvg from '$lib/components/main_page_sections/ProcessArrowSvg.svelte';
	import ProcessExpandIcon from '$lib/components/main_page_sections/ProcessExpandIcon.svelte';

	const toggleDescription = (/** @type {{ target: { nextElementSibling: any; }; }} */ event) => {
		const description = event.target.nextElementSibling;
		description.classList.toggle('expanded');
	};

	/** @type {Record<string, boolean>} */
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

	const arrowWidth = 15;
</script>

{#snippet processEntry(
	/** @type {"goals" | "data" | "design" | "solution"} */ id,
	/** @type {String} */ title,
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
			onclick={() => {
				/** @type {keyof typeof expanded} */
				// Object.keys(expanded).forEach((key) => {
				// 	if (key !== id) {
				// 		expanded[key] = false;
				// 	}
				// });
				expanded[id] = !expanded[id];
			}}
			bind:clientHeight={heightsTitle[id]}
		>
			<span>{@html title}</span>
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

<h2>{m.sec_about_process_title()}</h2>
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
	{@render processEntry('goals', m.process_goals_title(), m.process_goals_description())}
	{@render processEntry('data', m.process_data_title(), m.process_data_description())}
	{@render processEntry('design', m.process_design_title(), m.process_design_description())}
	{@render processEntry(
		'solution',
		m.process_solution_title(),
		m.process_solution_description()

		// If we deem it necessary, this can also lead to refining the design. I iterate on design and implementation until the solution fulfills the goals
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
		color: black;
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
</style>
