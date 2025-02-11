<script>
	import { i18n } from '$lib/i18n';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';
	import { languageTag } from '$lib/paraglide/runtime.js';
	import { fade } from 'svelte/transition';
	import SwitchLanguageButton from '$lib/components/SwitchLanguageButton.svelte';

	let hamburgerMenuOpen = $state(false);
	function toggleMenu() {
		hamburgerMenuOpen = !hamburgerMenuOpen;
	}

	/**
	 * @param {import("$lib/paraglide/runtime").AvailableLanguageTag} newLanguage
	 */
	function switchToLanguage(newLanguage) {
		const canonicalPath = i18n.route(page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}
</script>

<div class="desktop-nav to-fade-in_outdated">
	<div class="center-container">
		<nav class="heading-nav slim-fit-container space-between-container">
			<div class="nav-grid-left">
				<a href="https://benediktmayer.com/" class="logo-link"
					><span class="logo-text-content">Benedikt Mayer</span></a
				>
			</div>
			<div class="nav-grid-middle">
				<SwitchLanguageButton language={'en'} {switchToLanguage} />
				<!-- <span style:color="gray" style:font-size="1rem"></span> -->
				<SwitchLanguageButton language={'de'} {switchToLanguage} />
			</div>
			<div class="nav-grid-right">
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
<nav class="hamburger-nav to-fade-in_outdated">
	<div class="nav-grid-left">
		<a href="https://benediktmayer.com/" class="logo-link"
			><span class="logo-text-content">Benedikt Mayer</span></a
		>
	</div>
	<div class="nav-grid-middle">
		<SwitchLanguageButton language={'en'} {switchToLanguage} />
		<!-- <span style:color="gray" style:font-size="1rem">/</span> -->
		<SwitchLanguageButton language={'de'} {switchToLanguage} />
	</div>
	<div class="hamburger-menu nav-grid-right">
		<!-- <div
			class="hamburger-icon func-toggle-menu{hamburgerMenuOpen ? ' open' : ''}"
			onclick={toggleMenu}
			onkeydown={(e) => e.key === 'Enter' && toggleMenu()}
			aria-label="Toggle menu"
			role="button"
		>
			<span></span>
			<span></span>
			<span></span>
		</div> -->
		<button
			class="hamburger-icon func-toggle-menu{hamburgerMenuOpen ? ' open' : ''}"
			onclick={toggleMenu}
			onkeydown={(e) => e.key === 'Enter' && toggleMenu()}
			aria-label="Toggle menu"
		>
			<span></span>
			<span></span>
			<span></span>
		</button>
		<div class="menu-links{hamburgerMenuOpen ? ' open' : ''}">
			<li><a href="#projects-title" class="func-toggle-menu">{m.title_projects_abbrev()}</a></li>
			<li><a href="#about-title" class="func-toggle-menu">{m.title_about()}</a></li>
			<li><a href="#contact-title" class="func-toggle-menu">{m.title_contact()}</a></li>
		</div>
	</div>
</nav>
