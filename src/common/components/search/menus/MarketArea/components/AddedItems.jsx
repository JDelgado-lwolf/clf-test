import React from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList as List } from 'react-window';
import { ListGroup } from '@lwt-helix/list-group';
import { searchTerms } from '../../../../../../constants';

const AddedItems = ({ state, AddedAreaRow }) => {
    return state.filteredAddedAreas?.length
        ? <ListGroup flush>
            <List
                className='List'
                height='360'
                width='140'
                itemCount={state.filteredAddedAreas.length}
                itemSize={20}
                style={{
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    height: '370px',
                    paddingRight: '1rem'
                }}
            >
                {AddedAreaRow}
            </List>
        </ListGroup>
        : <div style={{ height: '360px', position: 'relative' }}>
            <div style={{ top: '45%', position: 'absolute' }} className='w-100 text-center'>
                <div className='font-weight-bold d-block'>{searchTerms.noneAdded}</div>
                <p className='text-muted'>{searchTerms.selectItemsFromLeft('areas')}</p>
            </div>
        </div>;
};

AddedItems.propTypes = {
    state: PropTypes.object,
    AddedAreaRow: PropTypes.element
};

export default AddedItems;
