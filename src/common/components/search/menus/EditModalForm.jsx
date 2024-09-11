import React from 'react';
import { PropTypes } from 'prop-types';
import { Row } from '@lwt-helix/layout';
import { Input, Label } from '@lwt-helix/controls';
import { searchTerms } from '../../../../constants';

const EditModalForm = props => {
    const { search, updateSavedSearch } = props;

    return <div className="mx-3">
        <Row>
            <Label dataLwtId="name-search-label">{searchTerms.searchName}</Label>
            <Input
                dataLwtId="name-search"
                defaultValue={search.savedSearch.searchName}
                onChange={e => updateSavedSearch('searchName', e.target.value.trim())}
                maxLength={80} autoFocus={true}
            />
        </Row>
        <Row>
            <Label dataLwtId="notes-search-label">{searchTerms.searchDescription}</Label>
            <Input
                dataLwtId="notes-search"
                placeholder={searchTerms.searchNotesPlaceholder}
                defaultValue={search.savedSearch.notes}
                onChange={e => updateSavedSearch('notes', e.target.value.trim())} maxLength={80}
            />
        </Row>
    </div>;
};

EditModalForm.propTypes = {
    search: PropTypes.object,
    updateSavedSearch: PropTypes.func,
};

export default EditModalForm;
