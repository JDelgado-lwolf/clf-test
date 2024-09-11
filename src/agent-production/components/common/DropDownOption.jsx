import React from 'react';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { chevron_small_down } from '@lwt-helix/helix-icon/outlined';
import { Button } from '@lwt-helix/buttons';
import Popover from '@lwt-helix/popover';
import { popoverTerms } from '../../constants/agentProductionConstants';
import PropTypes from 'prop-types';

const DropDownOption = ({
    popoverBody,
    dataLwtId,
    mainTitle,
    popoverInnerClassName,
    popoverClassName,
    popoverIsOpen,
    popoverHeader,
    popoverPlacement,
    togglePopover
}) => {

    const mainTitleContent = typeof mainTitle === 'string'
        ? <span className='text-capitalize'>{mainTitle}</span>
        : mainTitle;

    const popoverClass = popoverClassName ? `metrics-selector ${popoverClassName}` : '';

    return (
        <>
            <Button
                color='secondary'
                dataLwtId={dataLwtId}
                id={dataLwtId}
                size='sm'
            >
                <div className='d-flex align-items-center'>
                    {mainTitleContent}
                    <HelixIcon icon={chevron_small_down} className='ml-1' />
                </div>
            </Button>
            <Popover
                innerClassName={popoverInnerClassName}
                className={popoverClass}
                body={popoverBody}
                placement={popoverPlacement}
                header={popoverHeader}
                size={popoverTerms.auto}
                target={dataLwtId}
                id={dataLwtId}
                trigger={popoverTerms.legacy}
                toggle={(e) => togglePopover(e, dataLwtId)}
                isOpen={popoverIsOpen}
                modifiers={{
                    arrow: { enabled: false },
                    flip: { enabled: false }
                }}
            />
        </>
    )
};

DropDownOption.propTypes = {
    popoverBody: PropTypes.node.isRequired,
    dataLwtId: PropTypes.string.isRequired,
    mainTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    popoverInnerClassName: PropTypes.string,
    popoverIsOpen: PropTypes.bool.isRequired,
    popoverPlacement: PropTypes.string,
    togglePopover: PropTypes.func.isRequired
};

export default DropDownOption;
