import React from 'react';
import FormGroup from '@lwt-helix/form';
import { ListGroup, ListGroupItem } from '@lwt-helix/list-group';
import { agentProductionTerms, searchTerms } from '../../../../constants';

const MarketAreasList = props => {
    const { mappedAreas, allMls, selectType } = props;

    return <FormGroup>
        <ListGroup flush>
            <div className='mb-2' style={{ paddingBottom: '5px', borderBottom: '1px solid gainsboro' }}>
                <ListGroupItem
                    tag='button'
                    active={!!allMls}
                    className='chip-option'
                    onClick={(e) => selectType(e, agentProductionTerms.all)}
                >
                    {searchTerms.allMls}
                </ListGroupItem>
            </div>
            {mappedAreas && Object.values(mappedAreas)?.map((mappedArea) =>
                <div>
                    <ListGroupItem
                        tag='button'
                        className='chip-option'
                        onClick={(e) => selectType(e, mappedArea)}
                    >
                        {mappedArea.viewName}
                    </ListGroupItem>
                </div>
            )}
        </ListGroup>
    </FormGroup>;
};

export default MarketAreasList;
