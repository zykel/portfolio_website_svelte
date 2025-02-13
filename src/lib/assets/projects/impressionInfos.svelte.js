import * as m from '$lib/paraglide/messages.js';

/**
 * @typedef {Object} MediaInfo
 * @property {string} src
 * @property {string} caption
 * @property {string | null} videoId
 */

/**
 * @typedef {Object} ImpressionsParams
 * @property {MediaInfo[]} wide - Array of wide images.
 * @property {MediaInfo[]} small_left - Array of small left images.
 * @property {MediaInfo[]} small_right - Array of small right images.
 */

/**
 * @param {String} projectId
 * @returns {ImpressionsParams}
 */
export const getImpressionInfos = (projectId) => {
	if (projectId === 'characterization') {
		return {
			wide: [
				{
					src: '/projects/characterization/deviations.png',
					caption: m.caption_characterization_deviations(),
					videoId: null
				}
			],
			small_left: [
				{
					src: '/projects/characterization/trends.png',
					caption: m.caption_characterization_trends(),
					videoId: null
				},
				{
					src: '/projects/characterization/mds.png',
					caption: m.caption_characterization_mds(),
					videoId: null
				}
			],
			small_right: [
				{
					src: '/projects/characterization/sources.png',
					caption: m.caption_characterization_sources(),
					videoId: null
				},
				{
					src: '/projects/characterization/distribution.png',
					caption: m.caption_characterization_distribution(),
					videoId: null
				}
			]
		};
	} else if (projectId === 'endovis') {
		return {
			wide: [
				{
					src: '/projects/endovis/procedures.mp4',
					caption: m.caption_endovis_procedures(),
					videoId: 'procedures'
				}
			],
			small_left: [
				{
					src: '/projects/endovis/align.mp4',
					caption: m.caption_endovis_align(),
					videoId: 'align'
				}
			],
			small_right: [
				{
					src: '/projects/endovis/expand.mp4',
					caption: m.caption_endovis_expand(),
					videoId: 'expand'
				}
			]
		};
	} else if (projectId === 'exex') {
		return {
			wide: [
				{
					src: '/projects/exex/s1.mp4',
					caption: m.caption_exex_s1(),
					videoId: 's1'
				}
			],
			small_left: [
				{
					src: '/projects/exex/s4.mp4',
					caption: m.caption_exex_s4(),
					videoId: 's4'
				}
			],
			small_right: [
				{
					src: '/projects/exex/s3.mp4',
					caption: m.caption_exex_s3(),
					videoId: 's3'
				}
			]
		};
	} else {
		return {
			wide: [],
			small_left: [],
			small_right: []
		};
	}
};
