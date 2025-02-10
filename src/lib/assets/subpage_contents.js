import * as m from '$lib/paraglide/messages';

/**
 * @type {{ [key: string]: { projectId: string; title: string; paragraphs: string[] } }}
 */
export const subpageContents = {
	endovis: {
		projectId: 'endovis',
		title: 'Endovis',
		paragraphs: [
			m.endovis_description_paragraph_1(),
			m.endovis_description_paragraph_2(),
			m.endovis_description_paragraph_3()
		]
	}
};
