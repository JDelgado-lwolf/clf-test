import React from 'react';
import FormGroup from '@lwt-helix/form';
import { ListGroup, ListGroupItem } from '@lwt-helix/list-group';

const AreaTypesList = props => {
    const { areaTypes, selectType, selectedType } = props;

    return <FormGroup>
        <ListGroup flush>
            {areaTypes.map(areaType =>
                <div key={areaType.columnName}>
                    <ListGroupItem
                        tag='button'
                        // active={selectedType.fieldValues?.includes(areaType.columnName)}
                        value={areaType.columnName}
                        onClick={(e) => selectType(e, areaType)}>
                        {areaType.viewName}
                    </ListGroupItem>
                </div>
            )}
        </ListGroup>
    </FormGroup>;
};

export default AreaTypesList;
