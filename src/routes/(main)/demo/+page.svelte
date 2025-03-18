<div class="center-container">
	<div class="slim-fit-container" style:box-sizing="border-box">
		<div class="left-align-container">
			<h1 class="demo-page__title">Types of solutions</h1>
			<div class="limit-width">
				On this page, I explain the different types of solutions I offer:
				<ul>
					<li><span class="bold">Dashboards</span> for exploring data sets to find insights</li>
					<li>
						<span class="bold">Analytical reports</span> to summarize insights from an analysis
					</li>
					<li>
						<span class="bold">Data stories</span> to communicate insights in an engaging way
					</li>
				</ul>
				<br />
				<p>To do so, I use an accessible example scenario.</p>

				<div id="scenario-description-div">
					<p class="bold">Scenario</p>
					Bianca, the owner of a pizza restaurant, has collected the pizza sales data of the past year
					[1] and she wants to work with the resulting data set.
				</div>

				Depending on Bianca's goals, three different solutions are suitable.

				<h2>1. Dashboard</h2>
				<p>
					In the first case of our <a href="#scenario-description-div">scenario</a>, Bianca wants to
					explore the sales data to answer the following questions:
				</p>
				<ul>
					<li>Which pizzas are sold the most and which generate the most income?</li>
					<li>When are the most/the least pizzas sold?</li>
					<li>Which ingredients are used how often?</li>
				</ul>
				<p>
					Bianca would also like to be able to focus on specific pizzas or time periods to explore
					the data in more detail.
				</p>
				<p>
					To help Bianca reach her goals, I have created the following <a
						data-sveltekit-reload
						href="/demo/dashboard">dashboard</a
					>:
				</p>
			</div>
			<a data-sveltekit-reload href="/demo/dashboard">
				<img class="demo-teaser" src="/demo/dashboard.jpg" alt="Dashboard" /></a
			>
			<div class="limit-width">
				<p>
					The dashboard relies heavily on interaction to adjust various parameters and filters. For
					an explanation of how the dashboard can be used to answer Bianca's questions, you may
					refer to this YouTube video:
					<a href="https://www.youtube.com/watch?v=8Z9v6h5Y6Zo">Dashboard Demo</a>
				</p>
			</div>

			<div class="limit-width">
				<h2>2. Analytical report</h2>
				<p>
					In the second case of our <a href="#scenario-description-div">scenario</a>, Bianca has a
					list of questions that she would like to be get answers for based on the data. She does
					not want to explore the data herself, but rather receive a summary of the insights backed
					up by visualizations. She has the following questions:
				</p>
				<ul>
					<li>Which pizzas are sold the most/the least?</li>
					<li>How are the sales distributed over the course of an average week/an average day?</li>
					<li>Which ingredients are used the most?</li>
					<li>How can the business be improved?</li>
				</ul>

				<p>
					To help Bianca reach her goals, I have created the following <a
						data-sveltekit-reload
						href="/demo/report">analytical report</a
					>:
				</p>
				<a data-sveltekit-reload href="/demo/report">
					<img class="demo-teaser" src="/demo/report.jpg" alt="Analytical report" /></a
				>

				<p>
					Bianca can use the report to make informed decisions about her business. She can also use
					it to explain decisions to her employees, like the restaurant manager.
				</p>
			</div>

			<div class="limit-width">
				<h2>3. Data story</h2>
				<p>
					In the third case of our <a href="#scenario-description-div">scenario</a>, Bianca wants to
					engage potential customers, informing them about the pizzas offered in her restaurant and
					allowing the users to playfully explore the pizzas by price and popularity.
				</p>
				<p>
					To help Bianca reach her goals, I have created the following <a
						data-sveltekit-reload
						href="/demo/data-story">data story</a
					>:
				</p>
				<a data-sveltekit-reload href="/demo/data-story">
					<img class="demo-teaser" src="/demo/story.jpg" alt="Data story" /></a
				>
			</div>

			<a data-sveltekit-reload href="/demo/report">report</a>

			[1] The data set was taken from XY and slightly adjusted for the demos.
		</div>
	</div>
</div>

<!-- relatable -->

<style>
	.left-align-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
	}
	.bold {
		font-weight: bold;
	}
	ul {
		margin: 1rem 0;
	}
	li {
		margin-left: 1.5rem;
		line-height: 1.7rem;
	}
	#scenario-description-div {
		margin: 1rem 0;
		background-color: rgb(225, 225, 225);
		padding: 1rem;
		border-left: 4px solid rgb(44, 44, 44);
	}

	.limit-width {
		max-width: 700px;
	}
	p,
	ul {
		margin-block-end: 0.7rem;
		line-height: 1.7rem;
		/* margin-bottom: 1.7rem; */
	}
	h2 {
		margin-top: 2rem;
	}

	.demo-teaser {
		width: 100%;
		margin: 1rem 0;
		border-radius: 1rem;
		box-shadow: 0 0 16px rgba(0, 0, 0, 0.2);
	}
</style>
