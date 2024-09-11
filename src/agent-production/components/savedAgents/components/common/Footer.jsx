import React from 'react';
import { shortDateFormatWithSlashes } from '../../../../helpers/dataFormatters';
import { useSavedAgentsStore } from '../../../../../store/store';
import { searchTerms, agentProductionTerms } from '../../../../../constants';

const Footer = ({ timeInterval, propertyTypeNames }) => {
    const {
        getMlsName
    } = useSavedAgentsStore(state => ({
        getMlsName: state.getMlsName
    }));

    const fromDate = shortDateFormatWithSlashes(timeInterval?.from);
    const toDate = shortDateFormatWithSlashes(timeInterval?.to);
    const allResidential = `${searchTerms.allResidential}: (${propertyTypeNames.join(", ")})`;

    return (
        <div>
            <div>
                <span className='d-inline helix-text-gray-500'>
                    <span className='helix-body--strong ml-1'>{searchTerms.mls}:</span> {`${getMlsName()} `}
                    <span className='helix-body--strong ml-1'>{agentProductionTerms.area}:</span> {`${searchTerms.allMls} `}
                    <span className='helix-body--strong ml-1'>{searchTerms.timeFrame}:</span> {`${fromDate} - ${toDate} `}
                    <span className='helix-body--strong ml-1'>{searchTerms.propertyTypesSA}:</span> {allResidential}
                </span>
            </div>
        </div>
    );
};

export default Footer;
