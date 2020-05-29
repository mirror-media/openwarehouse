import _ from 'lodash';
function composeImageSet(imageObj = {}) {
	let resizedTargets = _.get(imageObj, 'resizedTargets');
	if (!resizedTargets) {
		return imageObj;
	}
	let original = {
		url: imageObj.url,
		width: imageObj.width,
		height: imageObj.height,
	};
	let image = {};
	return _.merge(image, resizedTargets, {
		original: original,
		url: _.get(resizedTargets, ['tablet', 'url']),
		description: imageObj.description,
		keywords: imageObj.keywords,
		id: imageObj.id,
	});
}

export function parseImageAPIResponse(apiResponse) {
	let imageObj = _.get(apiResponse, ['fields', 'image'], {});
	let id = apiResponse.id;
	let description = _.get(apiResponse, ['fields', 'description']);
	let keywords = _.get(apiResponse, ['fields', 'keywords']);
	let image = _.merge({}, imageObj, { id, description, keywords });
	return composeImageSet(image);
};

export function parseAudioAPIResponse(apiResponse) {
	let audio = _.get(apiResponse, ['fields', 'audio'], {});
	audio = _.pick(audio, ['filetype', 'title', 'url']);
	let coverPhoto = composeImageSet(_.get(apiResponse, ['fields', 'coverPhoto'], {}));
	let description = _.get(apiResponse, ['fields', 'description', 'html'], '');
	let title = _.get(apiResponse, ['fields', 'title'], '');
	audio = _.merge(audio, { id: apiResponse.id, coverPhoto, description, title });
	return audio;
};

export function parseVideoAPIResponse(apiResponse) {
	let video = _.get(apiResponse, ['fields', 'video'], {});
	video = _.pick(video, ['filetype', 'title', 'url']);
	let coverPhoto = composeImageSet(_.get(apiResponse, ['fields', 'coverPhoto'], {}));
	let description = _.get(apiResponse, ['fields', 'description', 'html'], '');
	let title = _.get(apiResponse, ['fields', 'title'], '');
	video = _.merge(video, { id: apiResponse.id, coverPhoto, description, title });
	return video;
};
