import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'zustand/shallow';
import Popover from '@lwt-helix/popover';
import { Button, ButtonGroup, ButtonIcon } from '@lwt-helix/buttons';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { home_compare } from '@lwt-helix/helix-icon/outlined';
import { chipIconProps } from '../../../helpers/chips';
import { buttonTerms, modules, searchTerms as st } from '../../../../constants';
import { setStateData } from '../../../helpers/state';
import { popoverModifiers } from '../../../helpers/search';
import { useCommonStore, useSearchStore } from '../../../../store/store';
import { useCloseChip } from './hooks/closeChip';
import { useComparisonSetsStore } from '../../../../store/comparisonSets/store';
import Modal from '@lwt-helix/modal';
import { Routes } from '../../../routes/routes';
import { ComparisonSets } from '../menus/ComparisonSets';

const ComparisonSetChip = props => {
    const { disabled, key, module, onClose } = props;

    const { membership } = useCommonStore(state => ({
        membership: state.membership
    }));

    const {
        title,
        setComparisonSetSearch,
        selectedComparisonSetSearch,
        selectedMls,
        searchFilters,
        resetComparisonSetSavedSearch,
        selectedSavedSearch,
    } = useSearchStore(state => ({
        setComparisonSetSearch: state.setComparisonSetSearch,
        title: state[module]?.comparisonSetTitle,
        selectedComparisonSetSearch: state[module]?.selectedComparisonSetSearch,
        selectedMls: state[module]?.selectedMls,
        searchFilters: state[module]?.searchFilters,
        resetComparisonSetSavedSearch: state.resetComparisonSetSavedSearch,
        selectedSavedSearch: state[module]?.selectedSavedSearch,
    }), shallow);

    const {
        comparisonSets,
        comparisonSetsBySelectedMls,
        comparisonSetListOptions,
        buildComparisonSetOptions,
    } = useComparisonSetsStore(state => ({
        comparisonSets: state.comparisonSets,
        comparisonSetsBySelectedMls: state.comparisonSetsBySelectedMls,
        comparisonSetListOptions: state.comparisonSetListOptionsBySelectedMls,
        buildComparisonSetOptions: state.buildComparisonSetOptions,
    }));

    const [state, setState] = useState({
        isPopoverOpen: false,
        modalProps: {
            messageType: undefined,
            redirectButtonTitle: undefined,
            shouldShow: false
        }
    });

    useCloseChip(state.isPopoverOpen, setState);

    const closeChip = () => {
        onClose(key);
        if (state.isPopoverOpen) {
            setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
        }
        setComparisonSetSearch(undefined);
        resetComparisonSetSavedSearch();
    };

    const togglePopover = () => setStateData('isPopoverOpen', !state.isPopoverOpen, setState);

    const toggleModal = (shouldShow) => setStateData('modalProps', {...state.modalProps, shouldShow}, setState);

    const handleCancelBtn = () => {
        toggleModal(false);
        setComparisonSetSearch(undefined);
        onClose(key);
    };

    const handleRedirectBtn = () => {
        window.location.replace(`${Routes.MY_PROFILE.BASE}?selectedTab=3`);
        setComparisonSetSearch(undefined);
        onClose(key);
    };

    const handleChipOptionsChange = (id) => {
        const comparisonSet = comparisonSetsBySelectedMls.find(cs => cs.id === id);
        setComparisonSetSearch(comparisonSet);
        resetComparisonSetSavedSearch();
    };

    useEffect(() => {
        if (!membership) return;
        if (!searchFilters.find(filter => filter === st.comparisonSetFilter)) {
            setComparisonSetSearch(undefined);
            return;
        }

        const builtComparisonSetOptions = buildComparisonSetOptions(modules.marketShare.totals);

        if(builtComparisonSetOptions?.messageType) {
            setStateData(
                'modalProps',
                builtComparisonSetOptions,
                setState,
            );
            return;
        }
    }, [comparisonSets, selectedMls, membership]);

    useEffect(() => {
        if (!selectedComparisonSetSearch?.id || !selectedSavedSearch?.id) return;
        const savedSearchComparisonSetId = selectedSavedSearch?.savedSearch?.searchCriteria?.
            criteria?.realEstateDatasourceIdsWithFilters[0]?.mlsObjectId

        if (savedSearchComparisonSetId === selectedComparisonSetSearch?.id) return;

        resetComparisonSetSavedSearch();
    }, [selectedComparisonSetSearch?.id, selectedSavedSearch?.id]);

    const ModalButtons = <div className='d-flex justify-content-end w-100'>
        <Button
            dataLwtId='cs-chip-modal-cancel-btn'
            color='secondary'
            className='mr-2'
            onClick={handleCancelBtn}
        >
            {buttonTerms.cancel}
        </Button>
        <Button
            dataLwtId='cs-chip-modal-redirect-btn'
            color='primary'
            onClick={handleRedirectBtn}
        >
            {state.modalProps.redirectButtonTitle}
        </Button>
    </div>;

    return (<>
        <ButtonGroup dataLwtId='comparison-set-chip-buttons'>
            <Button
                id='comparison-set-chip'
                dataLwtId='comparison-set-chip'
                size='sm'
                color='secondary'
                className='mb-1 text-capitalize text-truncate truncated-chip-button'
                onClick={togglePopover}
                disabled={disabled}
            >
                <HelixIcon icon={home_compare} {...chipIconProps} title='comparison set icon' />
                <span className='ml-2'>{title?.mainTitle}</span>
            </Button>
            <ButtonIcon
                    dataLwtId='close-comparison-sets'
                    size='xs'
                    color='secondary'
                    iconName='clear'
                    label={st.clearComparisonSets}
                    className='px-1 mb-1'
                    onClick={closeChip}
                    disabled={disabled}
                />
        </ButtonGroup>
        <Popover
            innerClassName='helix-heading'
            className='comparison-set-chip-popover'
            target='comparison-set-chip'
            placement='bottom'
            size='auto'
            trigger='legacy'
            header={st.comparisonSet}
            isOpen={state.isPopoverOpen}
            toggle={togglePopover}
            body={
                <ComparisonSets
                    initialComparisonSet={selectedComparisonSetSearch}
                    setComparisonSet={handleChipOptionsChange}
                    comparisonSetListOptions={comparisonSetListOptions}
                    togglePopover={togglePopover}
                />
            }
            disabled={disabled}
            {...popoverModifiers}
        />
        <Modal
            dataLwtId='comparison-sets-chip-modal'
            onClose={handleCancelBtn}
            title={' '}
            show={state.modalProps.shouldShow}
            size='sm'
            buttons={ModalButtons}
        >
                <p>{st.getNotCreatedMessage(state.modalProps.messageType)}</p>
                <p>{st.getCreateMessage(state.modalProps.messageType)}</p>
        </Modal>
    </>);
};

ComparisonSetChip.propTypes = {
    disabled: PropTypes.bool,
    key: PropTypes.string,
    module: PropTypes.string,
    onClose: PropTypes.func,
};

export default ComparisonSetChip;
