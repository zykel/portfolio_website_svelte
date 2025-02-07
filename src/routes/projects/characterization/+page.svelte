<script>
	import Footer from '$lib/components/Footer.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import ImpressionImg from '$lib/components/project_pages/ImpressionImg.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const slug = 'characterization';
</script>

<svelte:window
	onload={() => {
		// Preload the videos (necessary for safari)
		let videos = document.querySelectorAll('.teaser-video');
		videos.forEach((video) => {
			/** @type {HTMLVideoElement} */ (video).load();
		});
	}}
/>

<svelte:head>
	<title>{m.word_project()}: {m.characterization_project_title()}</title>
</svelte:head>

<Navigation />

<div class="center-container">
	<div class="slim-fit-container">
		<p class="project-page__title">{m.word_project()}: {m.characterization_project_title()}</p>
		<img
			src="/projects/characterization/title_pic.png"
			alt="A screenshot of the project"
			class="project-page__title-pic"
		/>

		<div class="project-page__text-content">
			<div class="project-page__description">
				<p class="project-page__paragraph">
					{m[`${slug}_description_paragraph_1`]()}
				</p>
				<p class="project-page__paragraph">
					{m.characterization_description_paragraph_2()}
				</p>
				<p class="project-page__paragraph">
					{m.characterization_description_paragraph_3()}
				</p>
				<p class="project-page__paragraph publication">
					{m.word_publication()}: B. Mayer, N. Steinhauer, B. Preim, and M. Meuschke. “A
					Characterization of Interactive Visual Data Stories With a Spatio-Temporal Context.” In:
					<span class="italics">Computer Graphics Forum</span>
					42.6 (2023), e14922.
					<a class="publication-doi" href="https://doi.org/10.1111/cgf.14922" target="_blank"
						>doi: 10.1111/cgf.14922</a
					>.
				</p>
			</div>

			<div class="project-page__details">
				<table>
					<tbody>
						<tr>
							<td class="project-page__detail-title">{m.word_type()}</td>
							<td>{m.tag_interactive_notebook()}</td>
						</tr>
						<tr>
							<td class="project-page__detail-title">{m.word_tech()}</td>
							<td>JavaScript, D3.js, Observable notebooks</td>
						</tr>
						<tr>
							<td class="project-page__detail-title">{m.word_roles()}</td>
							<td>{m.word_conceptualization()}, {m.word_design()}, {m.word_implementation()}</td>
						</tr>
						<tr>
							<td class="project-page__detail-title">{m.word_year()}</td>
							<td>2023</td>
						</tr>
						<tr>
							<td class="project-page__detail-title">{m.word_partners()}</td>
							<td>{m.pn_ovgu()}</td>
						</tr>
					</tbody>
				</table>

				<a
					href="https://observablehq.com/@zykel/characterization"
					class="project-page__visit-btn"
					target="_blank">{m.btn_visit_project()}</a
				>
			</div>
		</div>

		<div class="project-page__impressions">
			<p class="project-page__impressions-title">{m.word_impressions()}</p>

			<ImpressionImg
				src="/projects/characterization/deviations.png"
				caption={m.caption_characterization_deviations()}
				wide={true}
			/>

			<div class="project-page__impressions-small-container">
				<div class="project-page__impressions-small-left-column">
					<ImpressionImg
						src="/projects/characterization/trends.png"
						caption={m.caption_characterization_trends()}
					/>

					<ImpressionImg
						src="/projects/characterization/mds.png"
						caption={m.caption_characterization_mds()}
					/>
				</div>

				<div class="project-page__impressions-small-right-column">
					<ImpressionImg
						src="/projects/characterization/sources.png"
						caption={m.caption_characterization_sources()}
					/>

					<ImpressionImg
						src="/projects/characterization/distribution.png"
						caption={m.caption_characterization_distribution()}
					/>
				</div>
			</div>
		</div>
	</div>
</div>

<Footer />
