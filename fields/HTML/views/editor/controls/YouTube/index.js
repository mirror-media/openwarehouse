import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, Modifier } from 'draft-js';
import { getEntityRange, getSelectionEntity } from 'draftjs-utils';

import TwoInputs from '../../components/TwoInputs';

class YouTube extends Component {
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
            youtube: undefined,
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

    onChange = (id, description) => {
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
        contentState = contentState.createEntity('YOUTUBE', 'IMMUTABLE', {
            id: id,
            description: description,
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
            contentState.getEntity(currentEntity).get('type') === 'YOUTUBE'
        ) {
            currentValues.youtube = {};
            const entityRange =
                currentEntity && getEntityRange(editorState, currentEntity);
            currentValues.youtube.id =
                currentEntity && contentState.getEntity(currentEntity).get('data').id;
            currentValues.youtube.description =
                currentEntity &&
                contentState.getEntity(currentEntity).get('data').description;
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
            className: 'fab fa-youtube',
            title: "YouTube Link"
        },
        labels: {
            first: "YouTube ID",
            last: "Description"
        },
        isRequired: {
            first: true,
            last: false
        }
    });

    prepareLayoutCurrentState = (youtube) => ({
        twoInputs: {
            first: (youtube && youtube.id) || '',
            last: (youtube && youtube.description) || '',
        },
    });

    render() {
        const { translations } = this.props;
        const { expanded } = this.state;
        const { youtube } = this.getCurrentValues();
        return (
            <TwoInputs
                translations={translations}
                expanded={expanded}
                onExpandEvent={this.onExpandEvent}
                doExpand={this.doExpand}
                doCollapse={this.doCollapse}
                config={this.prepareLayoutConfig()}
                currentState={this.prepareLayoutCurrentState(youtube)}
                onChange={this.onChange}
            />
        );
    }
}

export default YouTube;
