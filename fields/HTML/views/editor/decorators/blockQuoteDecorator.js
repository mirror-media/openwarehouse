import React from 'react';

function strategy(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === 'BLOCKQUOTE'
        );
    }, callback);
}

const component = (props) => {
    const { quotedBy, quote, alignment } = props.contentState.getEntity(props.entityKey).getData();
    return (
        <div style={{ backgroundColor: "GhostWhite" }}>
            <blockquote className={`${alignment} `}>
                <div>{quote}</div>
                <h6>{`- ${quotedBy}`}</h6>
            </blockquote>
        </div>
    );
}

export default { strategy: strategy, component: component };
