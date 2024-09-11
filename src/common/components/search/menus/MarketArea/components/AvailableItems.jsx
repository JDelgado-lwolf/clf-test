import React from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList as List } from 'react-window';
import { ListGroup } from '@lwt-helix/list-group';
import Loader from '@lwt-helix/loader';

const AvailableItems = ({ state, AvailableAreaRow }) => {
    return !state.filteredAreas
        ? <Loader />
        : <ListGroup flush>
            <List
                className='List'
                height='360'
                width='140'
                itemCount={state.filteredAreas?.length}
                itemSize={20}
                style={{
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    height: '370px',
                    paddingRight: '1rem'
                }}
            >
                {AvailableAreaRow}
            </List>
        </ListGroup>;
};

AvailableItems.propTypes = {
    state: PropTypes.object,
    AvailableAreaRow: PropTypes.element
};

export default AvailableItems;
