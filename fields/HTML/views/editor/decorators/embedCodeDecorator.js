import React from 'react';
import { Helmet } from 'react-helmet';
import htmlParser from 'html-react-parser';

function strategy(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === 'EMBEDCODE'
        );
    }, callback);
}

const component = (props) => {
    const { caption, code, alignment } = props.contentState.getEntity(props.entityKey).getData();
    return (
        <div style={{ backgroundColor: "GhostWhite" }}>
            <div
                className={`embedded ${alignment}`}
                title={caption}
            >
                {htmlParser(code)}
                <Helmet>
                    {code.match(/<script.*\/script>/g).map(script => {
                        return htmlParser(script);
                    })}
                </Helmet>
            </div>
            <h6>{caption}</h6>
        </div>
    );
}

export default { strategy: strategy, component: component };
