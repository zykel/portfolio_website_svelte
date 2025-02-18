/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const projectId = params.projectId;

	return {
		projectId
	};
}

// Relevant, but did not end up using it: https://github.com/opral/inlang-paraglide-js/issues/164
