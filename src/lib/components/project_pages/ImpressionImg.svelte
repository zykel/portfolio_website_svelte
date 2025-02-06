<script>
	let { src, caption, wide = false } = $props();
</script>

<div class="project-page__impression-{wide ? 'wide' : 'small'}">
	<img {src} alt="Screenshot of the visualization" class="project-page__impression-pic" />
	<div class="impression-caption-container">
		<div class="impression-caption-static">
			{caption}
		</div>
	</div>
</div>
