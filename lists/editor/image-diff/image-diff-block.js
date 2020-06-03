'use strict';
import { AlignedImageDiff } from 'plate-model/dist/components/article/index';
import _ from 'lodash';
import AtomicBlockRendererMixin from '../mixins/atomic-block-renderer-mixin';
import EditingBt from '../base/editing-bt';
import ImageSelector from '../EditorComponents/ImageSelector';
import React from 'react';

export default class ImageDiffBlock extends AtomicBlockRendererMixin(React.Component) {
	constructor (props) {
		super(props);
	}

	_renderImageSelector (props) {
		return (
			<ImageSelector {...props}/>
		);
	}

	render () {
		if (!this.state.data) {
			return null;
		}

		let images = _.get(this.state.data, 'content', []);

		const EditBlock = this.state.editMode ? this._renderImageSelector({
			apiPath: 'images',
			isSelectionOpen: true,
			onChange: this.onValueChange,
			onFinish: this.toggleEditMode,
			selectedImages: images,
			selectionLimit: 2,
		}) : null;


		return (
			<div
				contentEditable={false}
				className="image-diff-container"
				style={{
					position: 'relative',
				}}
			>
				<AlignedImageDiff
					{...this.state.data}
				>
					{this.props.children}
				</AlignedImageDiff>
				<EditingBt
					onClick={this.toggleEditMode}
				/>
				{EditBlock}
			</div>
		);
	}
}
