import React from 'react';
import { CustomInput } from '@lwt-helix/controls';
import { searchTerms } from '../../constants';
import StatusTooltip from '../components/common/StatusTooltip';
import { listingStatuses } from '../constants/listingStatuses';

export const MAX_COUNT_SELECTIONS = 3;
export const MIN_COUNT_SELECTIONS = 1;

export const getCountChecked = (options) => {
    return options?.filter(o => o.checked && !o.isRadio)?.length || searchTerms.none.toLowerCase();
};

export const getRenderedStatusOptions = (options, handleOptionClick, countChecked) => {
    return (
        options?.map(option => (
            <>
                {option.isRadio ? <CustomInput
                    className='status-item my-2'
                    dataLwtId={option.id}
                    type={'radio'}
                    name={'statusOption'}
                    id={option.id}
                    checked={option.checked}
                    value={option.id}
                    label={option.label}
                    onClick={handleOptionClick}
                /> :
                    <div key={option.id} className={`py-2 ${option.tooltip && 'd-inline-flex status-row'}`} >
                        <CustomInput
                            className='status-item'
                            disabled={!option.checked && countChecked >= MAX_COUNT_SELECTIONS}
                            dataLwtId={option.id}
                            type={'checkbox'}
                            id={option.id}
                            checked={option.checked}
                            value={option.id}
                            label={option.label}
                            onClick={handleOptionClick}
                />
                {option.tooltip &&
                    <StatusTooltip option={option} />
                }
                    </div>}
                {option.isRadio && option.id === listingStatuses.sold.id ? <div className='status-divider'></div> : null}
            </>
        ))
    );
};
