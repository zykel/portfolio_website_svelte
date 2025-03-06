<script>
	let { sectionIds, sectionHeaders } = $props();
</script>

<section class="table-of-contents">
	<hr class="limit-width" />
	<h2 class="table-of-contents-text limit-width">Content:</h2>

	<p class="default-text limit-width">In this report, the following questions are answered:</p>
	<ol>
		{#each sectionIds as sectionId}
			<a href={`#${sectionId}`} class="table-of-contents-link limit-width"
				><li class="limit-width">{sectionHeaders[sectionId]}</li></a
			>
		{/each}
	</ol>
</section>
