import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, Modifier } from 'draft-js';
import { getEntityRange, getSelectionEntity } from 'draftjs-utils';

import TwoInputs from '../../components/TwoInputs';

class EmbedCode extends Component {
    static propTypes = {
        editorState: PropTypes.object,
        onChange: PropTypes.func,
        modalHandler: PropTypes.object,
        translations: PropTypes.object,
    };

    constructor(props) {
        super(props);
        const { editorState, modalHandler } = this.props;
        this.state = {
            expanded: false,
            embedCode: undefined,
            currentEntity: editorState ? getSelectionEntity(editorState) : undefined,
        };
        modalHandler.registerCallBack(this.expandCollapse);
    }

    componentDidUpdate(prevProps) {
        const { editorState } = this.props;
        if (editorState && editorState !== prevProps.editorState) {
            this.setState({ currentEntity: getSelectionEntity(editorState) });
        }
    }

    componentWillUnmount() {
        const { modalHandler } = this.props;
        modalHandler.deregisterCallBack(this.expandCollapse);
    }

    onExpandEvent = () => {
        this.signalExpanded = !this.state.expanded;
    };

    onChange = (caption, code) => {
        const { editorState, onChange } = this.props;
        const { currentEntity } = this.state;
        let selection = editorState.getSelection();

        if (currentEntity) {
            const entityRange = getEntityRange(editorState, currentEntity);
            const isBackward = selection.getIsBackward();
            if (isBackward) {
                selection = selection.merge({
                    anchorOffset: entityRange.end,
                    focusOffset: entityRange.start,
                });
            } else {
                selection = selection.merge({
                    anchorOffset: entityRange.start,
                    focusOffset: entityRange.end,
                });
            }
        }

        let contentState = editorState.getCurrentContent();
        contentState = Modifier.splitBlock(contentState, selection);
        contentState = contentState.createEntity('EMBEDCODE', 'IMMUTABLE', {
            caption: caption,
            code: code,
            alignment: 'center',
        });
        const entityKey = contentState.getLastCreatedEntityKey();

        contentState = Modifier.replaceText(
            contentState,
            selection,
            ' ',
            undefined,
            entityKey
        );

        let newEditorState = EditorState.push(
            editorState,
            contentState,
            'insert-characters'
        );

        onChange(newEditorState);
        this.doCollapse();
    };

    getCurrentValues = () => {
        const { editorState } = this.props;
        const { currentEntity } = this.state;
        const contentState = editorState.getCurrentContent();
        const currentValues = {};
        if (
            currentEntity &&
            contentState.getEntity(currentEntity).get('type') === 'EMBEDCODE'
        ) {
            currentValues.embedCode = {};
            const entityRange =
                currentEntity && getEntityRange(editorState, currentEntity);
            currentValues.embedCode.caption =
                currentEntity && contentState.getEntity(currentEntity).get('data').caption;
            currentValues.embedCode.code =
                currentEntity &&
                contentState.getEntity(currentEntity).get('data').code;
        }
        return currentValues;
    };

    doExpand = () => {
        this.setState({
            expanded: true,
        });
    };

    expandCollapse = () => {
        this.setState({
            expanded: this.signalExpanded,
        });
        this.signalExpanded = false;
    };

    doCollapse = () => {
        this.setState({
            expanded: false,
        });
    };

    prepareLayoutConfig = () => ({
        style: {
            icon: undefined,
            className: 'fa fa-code',
            title: "Embed Code"
        },
        labels: {
            first: "Caption",
            last: "Code"
        },
        isRequired: {
            first: true,
            last: true
        }
    });

    prepareLayoutCurrentState = (embedCode) => ({
        twoInputs: {
            first: (embedCode && embedCode.caption) || '',
            last: (embedCode && embedCode.code) || '',
        },
    });

    render() {
        const { translations } = this.props;
        const { expanded } = this.state;
        const { embedCode } = this.getCurrentValues();
        return (
            <TwoInputs
                translations={translations}
                expanded={expanded}
                onExpandEvent={this.onExpandEvent}
                doExpand={this.doExpand}
                doCollapse={this.doCollapse}
                config={this.prepareLayoutConfig()}
                currentState={this.prepareLayoutCurrentState(embedCode)}
                onChange={this.onChange}
            />
        );
    }
}

export default EmbedCode;
