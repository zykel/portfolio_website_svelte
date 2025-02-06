<script>
	import * as m from '$lib/paraglide/messages.js';
</script>

<section id="contact" class="center-col-container">
	<div class="slim-fit-container">
		<div class="section-title-grid">
			<div class="section-title-container">
				<h1 id="contact-title" class="light-font">
					<a class="section-title-a" href="#contact-title">{m.title_contact()}</a>
				</h1>
			</div>
			<div id="contact-title-rectangle" class="section-title-rectangle"></div>
		</div>
	</div>

	<div id="contact-content">
		<!-- <p class="contact-question">Do you have problems for which you would like to know whether they can be solved using data visualization?</p> -->
		<p class="contact-question project-animation-trigger" data-trigger-ref="contact">
			{m.sec_contact_question()}
		</p>
		<h1 class="call-contact">{m.sec_contact_invite()}</h1>
		<div id="contact-button-and-svg-grid">
			<div id="lines-svg-container">
				<svg id="lines-svg" xmlns="http://www.w3.org/2000/svg">
					<!-- viewBox="0 0 1000 100" -->
				</svg>
			</div>
			<div id="contact-button-container">
				<a href="mailto:mail@benediktmayer.com" class="contact-button">mail@benediktmayer.com</a>
				<a
					href="https://www.linkedin.com/in/benedikt-mayer-1981271b8/"
					class="contact-button"
					target="_blank">LinkedIn</a
				>
			</div>
		</div>
	</div>
</section>
