<script>
	import ImpressionImg from '$lib/components/project_pages/ImpressionImg.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getImpressionInfos } from '$lib/assets/projects/impressionInfos.svelte.js';
	/**
	 * @typedef {Object} ImageInfo
	 * @property {string} src
	 * @property {string} caption
	 */

	/**
	 * @typedef {Object} ImpressionsParams
	 * @property {ImageInfo[]} wide_imgs
	 * @property {ImageInfo[]} small_left_imgs
	 * @property {ImageInfo[]} small_right_imgs
	 */

	let { projectId } = $props();

	// const params = $derived(getImpressionInfos(projectId));
</script>

{#snippet impressions(
	/** @type {ImpressionsParams} */ { wide_imgs, small_left_imgs, small_right_imgs }
)}
	<p class="project-page__impressions-title">{m.word_impressions()}</p>

	{#each wide_imgs as img}
		<ImpressionImg src={img.src} caption={img.caption} wide={true} />
	{/each}

	<div class="project-page__impressions-small-container">
		<div class="project-page__impressions-small-left-column">
			{#each small_left_imgs as img}
				<ImpressionImg src={img.src} caption={img.caption} />
			{/each}
		</div>

		<div class="project-page__impressions-small-right-column">
			{#each small_right_imgs as img}
				<ImpressionImg src={img.src} caption={img.caption} />
			{/each}
		</div>
	</div>
{/snippet}

{@render impressions(getImpressionInfos(projectId))}
