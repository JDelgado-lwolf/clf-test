import React from 'react';
import PropTypes from 'prop-types';
import { marketDynamicsTerms, searchTypes } from '../../../constants';
import { useSearchStore } from '../../../store/store';

const TitleRow = (props) => {
    const { exportButton, statusOptionsSelector, listingViewOptions, chartToggle, module } = props;

    const shouldShowOptions = 
        !!chartToggle || !!listingViewOptions || !!statusOptionsSelector || !!exportButton;

    const {
        selectedSavedSearch
    } = useSearchStore(state => ({
        selectedSavedSearch: state[module]?.selectedSavedSearch
    }));

    const searchName = selectedSavedSearch
        ? selectedSavedSearch?.savedSearch?.searchName
        : marketDynamicsTerms.newSearch;
        
    return (
        <div className='row w-100 ml-2 my-2 pr-1 py-0'>
            <div className='labels-buttons-container'>
                <div className="d-flex align-items-center">
                    <h4 className='title-row text-truncate mb-0 font-gray-primary'
                    >
                        {searchTypes[location.pathname].title}
                    </h4>
                    <h6 className="text-truncate mb-0 helix-body">
                        {searchName}
                    </h6>
                </div>
                {shouldShowOptions && ( 
                    <div className="d-flex flex-row">
                        <div className="d-flex align-items-center justify-content-center">
                            {chartToggle}
                        </div>
                        {listingViewOptions}
                        {statusOptionsSelector}
                        <div className="md-title-row"> {exportButton} </div>
                    </div>
                )}
            </div>
        </div>
    );
};

TitleRow.propTypes = {
    chartToggle: PropTypes.element,
    exportButton: PropTypes.element,
    listingViewOptions: PropTypes.element,
    module: PropTypes.string, 
    statusOptionsSelector: PropTypes.element
};

export default TitleRow;
