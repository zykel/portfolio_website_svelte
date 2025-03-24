<script>
	import * as m from '$lib/paraglide/messages.js';
	import { languageTag } from '$lib/paraglide/runtime';
</script>

<div id="demo-content-container" class="center-container">
	<div class="slim-fit-container" style:box-sizing="border-box">
		<div class="left-align-container demo-container">
			<h1 class="demo-page__title">{m['demo_page_title']()}</h1>
			<div class="limit-width">
				{@html m['demo_page_introduction']()}

				{@html m['demo_page_scenario']()}

				<h2>1. {m.tag_dashboard()}</h2>

				{@html m['demo_page_dashboard_goals']()}
			</div>
			<a data-sveltekit-reload href="/demo/dashboard">
				<img class="demo-teaser" src="/demo/dashboard.jpg" alt="Dashboard" /></a
			>
			<div class="limit-width">
				<p>
					{@html m['demo_page_dashboard_outro']()}
					<!-- TODO: For an explanation of how the dashboard can be used to answer Bianca's
					questions, you may refer to this YouTube video:
					<a href="https://www.youtube.com/watch?v=8Z9v6h5Y6Zo">Dashboard Demo</a> -->
				</p>
			</div>

			<div class="limit-width">
				<h2>2. {m.tag_analytical_report()}</h2>

				{@html m['demo_page_report_goals']()}

				<a data-sveltekit-reload href="/demo/report">
					<img class="demo-teaser" src="/demo/report.jpg" alt="Analytical report" /></a
				>

				<p>
					{@html m['demo_page_report_outro']()}
				</p>
			</div>

			<div class="limit-width">
				<h2>3. {m.tag_visual_data_story()}</h2>

				{@html m['demo_page_story_goals']()}

				<a data-sveltekit-reload href="/demo/data-story">
					<img class="demo-teaser" src="/demo/story.jpg" alt="Data story" /></a
				>
				<p>
					{@html m['demo_page_story_outro']()}
				</p>
			</div>

			<br />
			<p id="footnote-1" class="footnote">
				[1] {@html m.demo_page_dataset_link()}
			</p>
		</div>
	</div>
</div>

<!-- relatable -->
