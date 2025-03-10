<script>
	let { sectionIds, sectionHeaders } = $props();
</script>

<section class="table-of-contents">
	<hr class="limit-width" />
	<h2 class="table-of-contents-text limit-width">Content:</h2>

	<p class="default-text limit-width">In this report, the following questions are answered:</p>
	<ol class="limit-width">
		{#each sectionIds as sectionId}
			<li>
				<a href={`#${sectionId}`} class="table-of-contents-link limit-width"
					>{sectionHeaders[sectionId]}</a
				>
			</li>
		{/each}
	</ol>
</section>
