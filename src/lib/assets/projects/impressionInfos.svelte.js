import * as m from '$lib/paraglide/messages.js';

/**
 * @typedef {Object} ImageInfo
 * @property {string} src
 * @property {string} caption
 */

/**
 * @typedef {Object} ImpressionsParams
 * @property {ImageInfo[]} wide_imgs
 * @property {ImageInfo[]} small_left_imgs
 * @property {ImageInfo[]} small_right_imgs
 */

/**
 * @param {String} projectId
 * @returns {ImpressionsParams}
 */
export const getImpressionInfos = (projectId) => {
	if (projectId === 'characterization') {
		return {
			wide_imgs: [
				{
					src: '/projects/characterization/deviations.png',
					caption: m.caption_characterization_deviations()
				}
			],
			small_left_imgs: [
				{
					src: '/projects/characterization/trends.png',
					caption: m.caption_characterization_trends()
				},
				{
					src: '/projects/characterization/mds.png',
					caption: m.caption_characterization_mds()
				}
			],
			small_right_imgs: [
				{
					src: '/projects/characterization/sources.png',
					caption: m.caption_characterization_sources()
				},
				{
					src: '/projects/characterization/distribution.png',
					caption: m.caption_characterization_distribution()
				}
			]
		};
	} else if (projectId === 'endovis') {
		return {
			wide_imgs: [
				{
					src: '/projects/characterization/deviations.png',
					caption: m.caption_characterization_deviations()
				}
			],
			small_left_imgs: [
				{
					src: '/projects/characterization/trends.png',
					caption: m.caption_characterization_trends()
				},
				{
					src: '/projects/characterization/mds.png',
					caption: m.caption_characterization_mds()
				}
			],
			small_right_imgs: [
				{
					src: '/projects/characterization/sources.png',
					caption: m.caption_characterization_sources()
				},
				{
					src: '/projects/characterization/distribution.png',
					caption: m.caption_characterization_distribution()
				}
			]
		};
	} else {
		return {
			wide_imgs: [],
			small_left_imgs: [],
			small_right_imgs: []
		};
	}
};
