'use strict';

import { AlignedInfoBox } from 'plate-model/dist/components/article/index';
import _ from 'lodash';
import AtomicBlockRendererMixin from '../mixins/atomic-block-renderer-mixin';
import InfoBoxEditingBlock from './info-box-editing-block';
import React from 'react';

export default class InfoBoxBlock extends AtomicBlockRendererMixin(React.Component) {
	constructor (props) {
		super(props);
	}

	render () {
		if (!this.state.data) {
			return null;
		}

		let blockContent = _.get(this.state.data, ['content', 0], {});
		let title = blockContent.title;
		let body = blockContent.body;
		let draftRawObj = blockContent.draftRawObj;
		const EditBlock = (
			<InfoBoxEditingBlock
				body={body}
				draftRawObj={draftRawObj}
				label="infobox"
				isModalOpen={this.state.editMode}
				title={title}
				onToggle={this.handleEditingBlockChange}
				toggleModal={this.toggleEditMode}
			/>
		);

		return (
			<div
				contentEditable={false}
				onClick={this.toggleEditMode}
				style={{ cursor: 'pointer' }}
			>
				<AlignedInfoBox
					{...this.state.data}
					device={this.props.device}
				>
					{this.props.children}
				</AlignedInfoBox>
				{EditBlock}
			</div>
		);
	}
};
