<script>
	import * as m from '$lib/paraglide/messages.js';
	import MyProcess from '$lib/components/main_page_sections/MyProcess.svelte';
</script>

<section id="about" class="center-col-container">
	<div class="slim-fit-container">
		<div class="section-title-grid">
			<div class="section-title-container">
				<h1 id="about-title" class="light-font">
					<a class="section-title-a" href="#about-title">{m['title_about']()}</a>
				</h1>
			</div>
			<div id="about-title-rectangle" class="section-title-rectangle"></div>
		</div>
	</div>

	<div
		id="about-content"
		class="slim-fit-container project-animation-trigger"
		data-trigger-ref="about"
	>
		<div id="pic-and-hi-container">
			<div id="profile-pic-container">
				<img src="/profile_pic_cropped_lighter.jpg" alt="Profile picture" class="about-pic" />
			</div>
			<p id="hi-text">{@html m['sec_about_greeting']()}</p>
		</div>
		<div id="work-and-background-container">
			<div class="self-description-and-background">
				<h2>{m['sec_about_work_title']()}</h2>
				{@html m['sec_about_work_paragraphs']()}
				{@html m['sec_about_work_bulletlist']()}
				<p class="paragraph">
					{m['sec_about_work_demo_reference_part1']()}
					<a href="demo" class="link-black" target="_blank"
						>{m['sec_about_work_demo_reference_linktext']()}</a
					>
					{m['sec_about_work_demo_reference_part2']()}
				</p>

				<h2 style:margin-top="3rem">{m['sec_about_background_title']()}</h2>
				<div class="cv-row">
					<div class="cv-time">{m.word_since()} 2024</div>
					<div class="cv-occupation">
						<span class="cv-jobname">{m.jobname_freelance()}</span><br />
						<span class="cv-location">Berlin</span>
					</div>
				</div>
				<div class="cv-row">
					<div class="cv-time">2019 - 2024</div>
					<div class="cv-occupation">
						<span class="cv-jobname">{m.jobname_phd()}</span><br />
						<span class="cv-location">{m.pn_ovgu()}</span>
					</div>
				</div>
				<div class="cv-row">
					<div class="cv-time">2017 - 2019</div>
					<div class="cv-occupation">
						<span class="cv-jobname">{m.jobname_master()}</span><br />
						<span class="cv-location">{m.pn_ovgu()}</span>
					</div>
				</div>
				<div class="cv-row">
					<div class="cv-time">2012 - 2017</div>
					<div class="cv-occupation">
						<span class="cv-jobname">{m.jobname_bachelor()}</span><br />
						<span class="cv-location">{m.pn_uni_konstanz()}</span>
					</div>
				</div>
			</div>

			<div id="background-container">
				<MyProcess />
			</div>
		</div>
	</div>
</section>
