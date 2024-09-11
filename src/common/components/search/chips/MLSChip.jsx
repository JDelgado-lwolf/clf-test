import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Popover from '@lwt-helix/popover';
import { Button } from '@lwt-helix/buttons';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { home_chart } from '@lwt-helix/helix-icon/outlined';
import { chipIconProps } from '../../../helpers/chips';
import { searchTerms } from '../../../../constants';
import { setStateData } from '../../../helpers/state';
import { popoverModifiers, toggleRunSearchButton } from '../../../helpers/search';
import MLSSearch from '../menus/MLSSearch';
import { useCommonStore} from '../../../../store/store';
import { useCloseChip } from './hooks/closeChip';

const MLSChip = props => {
    const { disabled, module, selectedMls } = props;
    const initialState = {
        isPopoverOpen: false,
        title: searchTerms.selectType(searchTerms.mls),
        selectedMlsId: undefined
    };
    const [state, setState] = useState({ ...initialState });

    useCloseChip(state.isPopoverOpen, setState);

    const mlsProviders = useCommonStore(state => state.mlsProviders);

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            selectedMlsId: selectedMls?.mlsId,
            title: selectedMls?.shortDescription || searchTerms.selectType(searchTerms.mls)
        }));
    }, [selectedMls]);

    useEffect(() => {
        toggleRunSearchButton(state.isPopoverOpen);
    }, [state.isPopoverOpen]);

    const togglePopover = () => setStateData('isPopoverOpen', !state.isPopoverOpen, setState);

    return (<>
        <Button
            dataLwtId='mls-chip'
            size='sm'
            color='secondary'
            className='mb-1 text-capitalize'
            id='mls-chip'
            disabled={disabled}
        >
            <HelixIcon icon={home_chart} {...chipIconProps} title='mls icon' />
            {state.title}
        </Button>

        {
            mlsProviders?.length !== 1 &&
            <Popover
                innerClassName='helix-heading'
                target='mls-chip'
                placement='bottom'
                size='auto'
                trigger='legacy'
                header={searchTerms.mlsProvider}
                isOpen={state.isPopoverOpen}
                toggle={togglePopover}
                body={<MLSSearch
                    mlsProviders={mlsProviders}
                    initialMlsId={state.selectedMlsId}
                    module={module}
                    togglePopover={togglePopover}
                />}
                disabled={disabled}
                {...popoverModifiers}
            />
        }
    </>);
};

MLSChip.propTypes = {
    disabled: PropTypes.boolean, 
    module: PropTypes.string, 
    selectedMls: PropTypes.object
};

export default MLSChip;
