<script>
	import { i18n } from '$lib/i18n';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';

	/**
	 * @param {import("$lib/paraglide/runtime").AvailableLanguageTag} newLanguage
	 */
	function switchToLanguage(newLanguage) {
		const canonicalPath = i18n.route(page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}
</script>

<div class="desktop-nav to-fade-in">
	<div class="center-container">
		<nav class="heading-nav slim-fit-container space-between-container">
			<div>
				<a href="https://benediktmayer.com/" class="logo-link"
					><span class="logo-text-content">Benedikt Mayer</span></a
				>
			</div>
			<div>
				<button onclick={() => switchToLanguage('en')}>en</button>
				<button onclick={() => switchToLanguage('de')}>de</button>
			</div>
			<div>
				<ul class="nav-links gap-row-container">
					<li>
						<a href="#projects-title" class="page-link"><span>{m.title_projects_abbrev()}</span></a>
					</li>
					<li><a href="#about-title" class="page-link"><span>{m.title_about()}</span></a></li>
					<li><a href="#contact-title" class="page-link"><span>{m.title_contact()}</span></a></li>
				</ul>
			</div>
		</nav>
	</div>
</div>
