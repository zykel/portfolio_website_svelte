<script>
	let { sectionIds, sectionHeaders } = $props();
</script>

<section class="table-of-contents">
	<h2 class="table-of-contents-text limit-width">Content:</h2>
	<ol>
		{#each sectionIds as sectionId}
			<a href={`#${sectionId}`} class="table-of-contents-link"
				><li>{sectionHeaders[sectionId]}</li></a
			>
		{/each}
	</ol>
</section>
