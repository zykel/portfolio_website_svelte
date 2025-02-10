/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const projectId = params.projectId;

	return {
		projectId
	};
}

// src/routes/+page.server.ts

// export const load({ locals }) {
//   return {
//     promotion: m[locals.i18nContext + "_promotion"](),
//     title: m[locals.i18nContext + "_title"](),
//   }
// }
