import React, { useEffect, useRef, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Button } from '@lwt-helix/buttons';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { ListGroupItem } from '@lwt-helix/list-group';
import { pencil } from '@lwt-helix/helix-icon/outlined';

export default function SavedSelection(props) {
    const {
        savedItem,
        isSelected,
        handleChange,
        editSavedItem,
        renderTooltip,
        getSavedItemName,
        getSavedItemNotes,
    } = props;

    const ref = useRef();
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if (ref.current && isSelected) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
    }, [isSelected]);

    const editIconDisplay = () => {
        setIsHovering(true);
    };

    const editIconHide = () => {
        setIsHovering(false);
    };

    const openEditModal = (e) => {
        editSavedItem(savedItem, e);
    };

    const classNameDesc = getSavedItemNotes && getSavedItemNotes(savedItem) ? 'edit-icon-container-w-desc' : '';

    return (
        <>
            {renderTooltip && renderTooltip(savedItem)}
            <div
                onMouseOver={editIconDisplay}
                onMouseOut={editIconHide}
                className="saved-search-selection"
                id={`saved-search-${savedItem.id}-tooltip`}
            >
                <div className="saved-search-menu-label">
                    <ListGroupItem
                        tag="button"
                        className="saved-search-menu-item"
                        active={isSelected}
                        onClick={(e) => handleChange(e, savedItem.id)}
                    >
                        <div>
                            <div
                                className="text-truncate helix-body--strong saved-search-name"
                                style={{ width: '270px', whiteSpace: 'pre'}}
                                ref={ref}
                            >
                                {getSavedItemName(savedItem)}
                            </div>
                            {getSavedItemNotes && <div className="text-truncate helix-small saved-search-desc" style={{ width: '270px', whiteSpace: 'pre' }}>
                                {getSavedItemNotes(savedItem)}
                            </div>}
                        </div>
                    </ListGroupItem>
                </div>
                <div className={`valign-container edit-icon-container ${classNameDesc}`}
                     style={{ display: isHovering ? 'flex' : 'none' }}
                >
                    <Button
                        className="edit-icon-button"
                        dataLwtId={`edit-icon-${savedItem.id}`}
                        size="sm"
                        color="link"
                        onClick={openEditModal} >
                        <HelixIcon icon={pencil} className='align-top' title='edit icon'/>
                    </Button>
                </div>
            </div>
        </>
    );
};

SavedSelection.propTypes = {
    savedItem: PropTypes.object,
    isSelected: PropTypes.bool,
    handleChange: PropTypes.func,
    editSavedItem: PropTypes.func,
    renderTooltip: PropTypes.node,
    getSavedItemName: PropTypes.func,
    getSavedItemNotes: PropTypes.func,
};
