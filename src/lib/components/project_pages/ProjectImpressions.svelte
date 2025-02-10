<script>
	import ImpressionImg from '$lib/components/project_pages/ImpressionImg.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getImpressionInfos } from '$lib/assets/projects/impressionInfos.svelte.js';
	import ImpressionVideo from '$lib/components/project_pages/ImpressionVideo.svelte';
	/**
	 * @typedef {Object} MediaInfo
	 * @property {string} src
	 * @property {string} caption
	 * @property {string | null} videoId
	 */

	/**
	 * @typedef {Object} ImpressionsParams
	 * @property {MediaInfo[]} wide - Array of wide images.
	 * @property {MediaInfo[]} small_left - Array of small left images.
	 * @property {MediaInfo[]} small_right - Array of small right images.
	 */

	let { projectId } = $props();
</script>

{#snippet impressions(/** @type {ImpressionsParams} */ { wide, small_left, small_right })}
	<div class="project-page__impressions">
		<p class="project-page__impressions-title">{m.word_impressions()}</p>

		{#each wide as { src, caption, videoId }}
			{#if videoId === null}
				<ImpressionImg {src} {caption} wide={true} />
			{:else}
				<ImpressionVideo {src} {caption} wide={true} {videoId} />
			{/if}
		{/each}

		<div class="project-page__impressions-small-container">
			<div class="project-page__impressions-small-left-column">
				{#each small_left as { src, caption, videoId }}
					{#if videoId === null}
						<ImpressionImg {src} {caption} />
					{:else}
						<ImpressionVideo {src} {caption} {videoId} />
					{/if}
				{/each}
			</div>

			<div class="project-page__impressions-small-right-column">
				{#each small_right as { src, caption, videoId }}
					{#if videoId === null}
						<ImpressionImg {src} {caption} />
					{:else}
						<ImpressionVideo {src} {caption} {videoId} />
					{/if}
				{/each}
			</div>
		</div>
	</div>
{/snippet}

{@render impressions(getImpressionInfos(projectId))}
