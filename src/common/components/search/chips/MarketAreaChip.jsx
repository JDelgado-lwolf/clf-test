import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Popover from '@lwt-helix/popover';
import { Button } from '@lwt-helix/buttons';
import Modal from '@lwt-helix/modal';
import { ToastContainer } from '@lwt-helix/toast';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { map_pin } from '@lwt-helix/helix-icon/outlined';
import { chipIconProps } from '../../../helpers/chips';
import MarketArea from '../menus/MarketArea/MarketArea';
import { setStateData } from '../../../helpers/state';
import { popoverModifiers, toggleRunSearchButton } from '../../../helpers/search';
import { showToast } from '../../../helpers/toast';
import { agentProductionTerms, areaRequestTypes, areaSearchTypes, modules, searchTerms } from '../../../../constants';
import { useCommonStore, useSearchStore } from '../../../../store/store';
import { useCloseChip } from './hooks/closeChip';

const MarketAreaChip = props => {
    const { disabled, module, userId, selectedMls, selectedSavedSearch, mlsProps } = props;

    const initialState = {
        isPopoverOpen: false,
        title: undefined,
        mlsId: undefined,
        shouldShowErrorModal: false,
        selectedMarketAreaListId: undefined,
        selectedMarketAreas: undefined
    };
    const [state, setState] = useState({ ...initialState });

    useCloseChip(state.isPopoverOpen, setState, state.isListModalOpen);

    const {
        search,
        title
    } = useSearchStore(state => ({
        search: state[module]?.search,
        title: state[module]?.marketAreaTitle
    }));

    const mappedAreas = mlsProps?.mappedAreas;

    const marketAreaLists = useCommonStore(state => state.marketAreaLists);

    const isMarketDynamics = module === modules.marketDynamics.marketDynamics;

    const popoverHeader = isMarketDynamics
        ? searchTerms.areaType
        : searchTerms.marketArea;

    useEffect(() => {
        if (module && selectedMls && mappedAreas) {
            let options = [{
                label: searchTerms.allMls,
                options: [{ label: searchTerms.allMls, value: agentProductionTerms.all }]
            }];
            if (mappedAreas) {
                options.push({
                    label: searchTerms.areaOptions,
                    options: Object.values(mappedAreas).map(mappedArea => {
                        return {
                            label: mappedArea.viewName,
                            value: areaRequestTypes[mappedArea.columnName]
                        };
                    })
                });
            }
            setState(prevState => ({
                ...prevState,
                mappedAreas: mappedAreas,
                options: options
            }));
        }
    }, [module, selectedMls, mappedAreas, search]);

    useEffect(() => {
        if (selectedMls) {
            const mls = {
                ...search?.searchCriteria?.criteria?.realEstateDatasourceIdsWithFilters?.find(mls =>
                    mls.realEstateDatasourceId === (selectedMls?.mlsId ?? search.mlsId)
                )
            };
            const marketAreas = mls?.searchFields?.find(f => areaSearchTypes.includes(f.fieldName));
            setState(prevState => ({
                ...prevState,
                allMLS: !!mls.searchAllMLS,
                selectedMarketAreaCriteria: marketAreas
            }));
        }
    }, [search]);

    useEffect(() => {
        try {
            marketAreaLists && selectedMls && setStateData(
                'marketAreaLists',
                [...marketAreaLists].filter(list => list.mlsId === selectedMls?.mlsId).map(list => ({
                        ...list,
                        // eslint-disable-next-line no-useless-escape
                        elements: JSON.parse(list.elements.replaceAll('\""', ''))
                    })
                ),
                setState
            );
        } catch (error){
            console.error(error)
        }
    }, [marketAreaLists, selectedMls]);

    useEffect(() => {
        toggleRunSearchButton(state.isPopoverOpen);
    }, [state.isPopoverOpen]);

    const closePopover = () => {
        setState(prevState => ({
            ...prevState,
            shouldShowErrorModal: false,
            isListModalOpen: false,
            isPopoverOpen: false
        }));
    };

    const setSelectedSortOption = option => {
        setStateData('selectedSortOption', option, setState);
    };

    const setFilterText = filterText => {
        setStateData('filterText', filterText, setState);
    };

    const togglePopover = async () => {
        if (state.isPopoverOpen) {
            if (!state.shouldShowErrorModal && !state.isListModalOpen) {
                setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
            }
        } else {
            setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
        }
    };

    const toggleErrorModal = () => {
        if (state.shouldShowErrorModal) {
            // delay closing the modal until the togglePopover is called
            setTimeout(() => setStateData('shouldShowErrorModal', !state.shouldShowErrorModal, setState), 500);
        } else {
            setStateData('shouldShowErrorModal', !state.shouldShowErrorModal, setState);
        }
    };

    const toggleListModal = () => setStateData('isListModalOpen', !state.isListModalOpen, setState);

    const setToastProps = (type, message) => {
        showToast(type, message, setState);
    };

    return (
        <>
            <Button
                dataLwtId='area-chip'
                size='sm'
                color='secondary'
                className='mb-1 text-capitalize text-truncate truncated-chip-button'
                id='location'
                onClick={() => togglePopover()}
                disabled={disabled}
                style={{ whiteSpace: 'pre' }}
            >
                <HelixIcon icon={map_pin} {...chipIconProps} title='map-pin icon' />
                {title?.mainTitle}
                <span style={{ textTransform: 'none' }}>
                    {title?.subTitle && `: ${title.subTitle}`}
                </span>
            </Button>
            <Popover
                innerClassName='helix-heading'
                target='location'
                placement='bottom'
                size='auto'
                trigger='legacy'
                header={popoverHeader}
                style={{ minWidth: '300px' }}
                isOpen={state.isPopoverOpen}
                toggle={() => togglePopover()}
                body={
                    <>
                        <div>
                            <MarketArea
                                mlsId={selectedMls?.mlsId}
                                marketAreaLists={state.marketAreaLists}
                                selectedMarketAreaCriteria={state.selectedMarketAreaCriteria}
                                userId={userId}
                                module={module}
                                typeOptions={state.options}
                                toggleErrorModal={toggleErrorModal}
                                toggleListModal={toggleListModal}
                                showToast={setToastProps}
                                closePopover={closePopover}
                                allMls={state.allMLS}
                                selectedSortOption={state.selectedSortOption}
                                setSortOption={setSelectedSortOption}
                                filterText={state.filterText}
                                setFilterText={setFilterText}
                                mappedAreas={state.mappedAreas}
                                selectedSavedSearch={selectedSavedSearch}
                            />
                        </div>
                        <Modal
                            title='Too many selections'
                            children={
                                <div style={{ padding: '0 30px' }}>
                                    <div style={{ float: 'left', fontSize: '3rem', width: '20%' }}>
                                        <i className='material-icons alert-icon text-danger'>
                                            warning
                                        </i>
                                    </div>
                                    <div>
                                        You have selected too many options. <br />
                                        Please limit your selection to 500.
                                    </div>
                                </div>
                            }
                            show={state.shouldShowErrorModal}
                            onClose={toggleErrorModal}
                        />
                    </>
                }
                disabled={disabled}
                {...popoverModifiers}
            />
            <ToastContainer
                position='toast-bottom-right'
                dataLwtId='save-list-toasts'
                toastProps={state.toastProps}
            />
        </>
    );
};

MarketAreaChip.propTypes = {
    disabled: PropTypes.bool,
    module: PropTypes.string,
    userId: PropTypes.string,
    selectedMlsId: PropTypes.number,
    selectedSavedSearch: PropTypes.object
};

export default MarketAreaChip;
