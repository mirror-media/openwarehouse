import React from 'react';
import styleSheet from './style';

import { Button, Popover, IconButton } from '@material-ui/core';
import { Clear } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles';
import { usePopupState, bindTrigger, bindPopover } from 'material-ui-popup-state/hooks'

import { useWindowDimensions } from '../../../helpers/useWindowDimensions';
import { useItem } from '../../../helpers/useItem';
import { lockPage } from '../../../helpers/lockPage';
import { useLeave } from '../../../helpers/useLeave';


const useStyles = makeStyles(styleSheet);

const Preview = () => {
    const { list, slug } = useItem();

    if (list == 'Post') {
        lockPage();
        useLeave();
    }

    let src = undefined;
    if (slug) {
        src = `https://www.mirrormedia.mg/story/${slug.value}?preview=true`;
    }

    const popupState = usePopupState({ variant: 'popover', popupId: 'imagePopover' })
    const { width } = useWindowDimensions();
    const classes = useStyles({ width, defaultColumns: 2, currentRows: 6 });

    const close = () => {
        popupState.close();
    }

    return (
        <div>
            {
                list == "Post" &&
                <div className={classes.root}>
                    <Button
                        variant="contained"
                        color="primary"
                        disableRipple={true}
                        {...bindTrigger(popupState)}
                    >
                        Preview
                    </Button>
                    <Popover
                        className={classes.popover}
                        anchorReference="anchorPosition"
                        anchorPosition={{ top: 0, left: 0 }} // overrided!
                        marginThreshold={16}
                        {...bindPopover(popupState)}
                    >
                        <iframe
                            src={src}
                            style={{ width: "100%", height: "100%", minWidth: "100%", border: "none" }}
                        />
                        <IconButton className={classes.closeButton} onClick={close}>
                            <Clear />
                        </IconButton>
                    </Popover>
                </div >
            }
        </div>
    );
}

export default Preview;
