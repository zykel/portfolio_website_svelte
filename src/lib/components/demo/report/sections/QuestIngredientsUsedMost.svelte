<script>
	let { sectionId, data, sectionHeader = $bindable() } = $props();

	const question = 'which ingredients should always be on stash?';
	sectionHeader = question;
</script>

<section id={sectionId}>
	<hr />
	<h2 id="{sectionId}-header" class="section-header limit-width">
		{question}
	</h2>
	<p class="default-text limit-width">
		This is some default explanations regarding the content of the dashboard.
	</p>
	<p class="interaction-text limit-width">
		Interaction: Here I describe how the interaction takes place.
	</p>
	<p class="insight-text limit-width">
		This is some text to give the answer to a question proposed at the beginning of a section.
	</p>
</section>
