<script>
	import { languageTag } from '$lib/paraglide/runtime';

	let { language, switchToLanguage } = $props();
</script>

<button class:selected={languageTag() === language} onclick={() => switchToLanguage(language)}
	>{language}</button
>

<style>
	button {
		background-color: transparent;
		border: none;
		cursor: pointer;
		font-size: 1.25rem;
		padding: 0 0.1rem;
		color: gray;
		/* text-transform: uppercase; */
		/* display: inline-block; */
	}

	button.selected {
		color: black;
		text-decoration: underline;
	}

	button:hover {
		text-decoration: underline;
	}
</style>
