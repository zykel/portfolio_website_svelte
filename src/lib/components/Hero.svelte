<script>
	import * as m from '$lib/paraglide/messages.js';
</script>

<!-- HERO -->
<section id="hero" class="to-fade-in">
	<div id="hero-video-container">
		<!-- <img src="assets/hero_img.png" alt="Title picture"> -->
		<video loop autoplay muted playsinline id="hero-video" poster="/hero_video_poster.png">
			<source src="/hero_pulse.mp4" type="video/mp4" />
			<!-- <source src="movie.ogg" type="video/ogg"> -->
			Your browser does not support the video tag.
		</video>
		<div class="safari-play-button-cover"></div>
		<h1 id="hero-text">
			{@html m['hero_text']()}
		</h1>
	</div>
	<!-- <div class="center-container">
            <div class="slim-fit-container">
                <h1 id="projects-title" class="light-font">selected projects</h1>
            </div>
        </div> -->
</section>
