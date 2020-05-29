import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { stopPropagation } from '../../utils/common';
import Option from '../../components/Option';
import './styles.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

class TwoInputs extends Component {
    static propTypes = {
        expanded: PropTypes.bool,
        doExpand: PropTypes.func,
        doCollapse: PropTypes.func,
        onExpandEvent: PropTypes.func,
        config: PropTypes.object,
        onChange: PropTypes.func,
        currentState: PropTypes.object,
        translations: PropTypes.object,
    };

    state = {
        showModal: false,
        lastInput: '',
        firstInput: '',
    };

    componentDidUpdate(prevProps) {
        if (prevProps.expanded && !this.props.expanded) {
            this.setState({
                showModal: false,
                lastInput: '',
                firstInput: '',
            });
        }
    }

    add = () => {
        const { onChange } = this.props;
        const { firstInput, lastInput } = this.state;
        onChange(firstInput, lastInput);
    };

    updateValue = event => {
        this.setState({
            [`${event.target.name}`]: event.target.value,
        });
    };

    hideModal = () => {
        this.setState({
            showModal: false,
        });
    };

    signalExpandShowModal = () => {
        const {
            onExpandEvent,
            currentState: { twoInputs },
        } = this.props;
        onExpandEvent();
        this.setState({
            showModal: true,
            lastInput: (twoInputs && twoInputs.last) || '',
            firstInput: (twoInputs && twoInputs.first) || '',
        });
    };

    forceExpandAndShowModal = () => {
        const {
            doExpand,
            currentState: { twoInputs, selectionText },
        } = this.props;
        doExpand();
        this.setState({
            showModal: true,
            lastInput: twoInputs && twoInputs.last,
            firstInput: (twoInputs && twoInputs.first) || selectionText,
        });
    };

    renderAddModal() {
        const {
            config: { popupClassName, labels, isRequired },
            doCollapse,
            translations,
        } = this.props;
        const { firstInput, lastInput } = this.state;
        return (
            <div
                className={classNames('rdw-link-modal', popupClassName)}
                onClick={stopPropagation}
            >
                <label className="rdw-link-modal-label" htmlFor="linkTitle">
                    {labels['first']}
                </label>
                <input
                    id="firstInput"
                    className="rdw-link-modal-input"
                    onChange={this.updateValue}
                    onBlur={this.updateValue}
                    name="firstInput"
                    value={firstInput}
                />
                <label className="rdw-link-modal-label" htmlFor="linkTarget">
                    {labels['last']}
                </label>
                <textarea
                    id="lastInput"
                    className="rdw-link-modal-textarea"
                    onChange={this.updateValue}
                    onBlur={this.updateValue}
                    name="lastInput"
                    value={lastInput}
                />
                <span className="rdw-link-modal-buttonsection">
                    <button
                        className="rdw-link-modal-btn"
                        onClick={this.add}
                        disabled={(isRequired.first && !firstInput) || (isRequired.last && !lastInput)}
                    >
                        {translations['generic.add']}
                    </button>
                    <button className="rdw-link-modal-btn" onClick={doCollapse}>
                        {translations['generic.cancel']}
                    </button>
                </span>
            </div>
        );
    }

    render() {
        const {
            config: { style, className },
            expanded,
        } = this.props;
        const { showModal } = this.state;
        return (
            <div
                className={classNames('rdw-link-wrapper', className)}
                aria-label="rdw-link-control"
            >
                <Option
                    value="unordered-list-item"
                    className={classNames(style.className)}
                    onClick={this.signalExpandShowModal}
                    aria-haspopup="true"
                    aria-expanded={showModal}
                    title={style.title}
                >
                    <img src={style.icon} alt="" />
                </Option>
                {expanded && showModal ? this.renderAddModal() : undefined}
            </div>
        );
    }
}

export default TwoInputs;
