'use strict';

import { AlignedQuoteBy } from 'plate-model/dist/components/article/index';
import _ from 'lodash';
import AtomicBlockRendererMixin from '../mixins/atomic-block-renderer-mixin';
import BlockQuoteEditingBlock from './block-quote-editing-block';
import React from 'react';

export default class BlockQuoteBlock extends AtomicBlockRendererMixin(React.Component) {
	constructor (props) {
		super(props);
	}

	render () {
		if (!this.state.data) {
			return null;
		}

		let blockContent = _.get(this.state.data, ['content', 0], {});
		let quote = blockContent.quote;
		let quoteBy = blockContent.quoteBy;

		const EditBlock = (
			<BlockQuoteEditingBlock
				label="blockquote"
				isModalOpen={this.state.editMode}
				onToggle={this.handleEditingBlockChange}
				quote={quote}
				quoteBy={quoteBy}
				toggleModal={this.toggleEditMode}
			/>
		);

		return (
			<div
				contentEditable={false}
				onClick={this.toggleEditMode}
				style={{ cursor: 'pointer' }}
			>
				<AlignedQuoteBy
					{...this.state.data}
					device={this.props.device}
				>
				{this.props.children}
				</AlignedQuoteBy>
				{EditBlock}
			</div>
		);
	}
}
