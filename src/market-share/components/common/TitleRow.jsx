import React, { useEffect, useState } from 'react';
import { Dropdown } from '@lwt-helix/dropdown';
import PropTypes from 'prop-types';
import { CustomInput } from '@lwt-helix/controls';
import { listingTypes, marketShareTerms, showHideTypes } from '../../constants';
import OptionsSelector from './OptionsSelector';
import { searchTerms, searchTypes } from '../../../constants';
import { useSearchStore } from '../../../store/store';
import { setStateData } from '../../../common/helpers/state';

const TitleRow = props => {
    const {
        titleContent,
        setListingViewId,
        setListingTypeId,
        showHideOptions,
        updateParentColumns,
        exportButton,
        module,
        hasInitialSearchRun,
        handleShowHideChart,
        isShowChart,
        isComparisonSetView
    } = props;

    const {
        selectedSavedSearch
    } = useSearchStore(state => ({
        selectedSavedSearch: state[module]?.selectedSavedSearch
    }));

    const [state, setState] = useState({
        selectedSearch: null,
        listingTypeValue: null,
        listingView: null,
        showHideColumns: null,
        selectedColumnId: null,
        showHideOptions: null
    });

    useEffect(() => {
        setState((prevState) => {
            const listingView = titleContent?.listingViews?.find(lv => lv.label === titleContent.rank)?.id;
            return {
                ...prevState,
                listingTypeValue: titleContent?.listingTypes?.find(lt => lt.isDefault)?.id,
                listingView,
                showHideColumns: showHideOptions?.columns?.map(option => {
                    return { ...option, hide: !option.isDefault };
                }),
                showHideOptions: showHideOptions?.options?.map(option => {
                    return { ...option, hide: !option.isDefault };
                })
            };
        });
    }, [titleContent, showHideOptions]);

    useEffect(() => {
        setStateData('selectedSearch', selectedSavedSearch, setState);
    }, [selectedSavedSearch]);

    const listingTypeOptions = titleContent?.listingTypes?.map(option => {
        return {
            dataLwtId: option.id,
            itemText: option.label,
            key: option.id,
            onClick: () => {
                setListingTypeId(option.id);
                setStateData('listingTypeValue', option.id, setState);
            }
        };
    }).filter(option => option.key !== listingTypes.comparisonSet.id);

    const listingViewOptions = titleContent?.listingViews?.map(option => {
        return {
            dataLwtId: option.id,
            itemText: option.label,
            key: option.id,
            onClick: () => {
                setListingViewId(option.id);
                setStateData('listingView', option.id, setState);
            }
        };
    });

    const handleShowHideOptionsClick = (e) => {
        const item = e.target;
        const clickedOptionId = item.value;
        const isChecked = item.checked;

        const updatedColumns = state.showHideColumns.map(option => {
            if (option.id === clickedOptionId) {
                return { ...option, hide: !isChecked };
            }
            return option;
        });

        const updatedOptions = state.showHideOptions.map(option => {
            if (option.id === clickedOptionId) {
                return { ...option, hide: !isChecked };
            }
            return option;
        });

        setState((prevState) => {
            return {
                ...prevState,
                showHideColumns: updatedColumns,
                showHideOptions: updatedOptions,
                selectedColumnId: clickedOptionId
            };
        });
    };

    useEffect(() => {
        if (state.selectedColumnId) {
            updateParentColumns({
                updatedColumns: state.showHideColumns,
                updatedOptions: state.showHideOptions,
                columnId: state.selectedColumnId
            });
        }
        setState((prevState) => {
            if (prevState.selectedColumnId === state.selectedColumnId) {
                return {
                    ...prevState,
                    selectedColumnId: null
                };
            }
        });
    }, [state.showHideColumns, state.showHideOptions, state.selectedColumnId]);

    const showHideMetricsList = [];

    const showHideMetricsOptions = state?.showHideOptions?.map(option => {
        if (option.id === showHideTypes.chart.id) return;
        return <>
            <div className='border-bottom py-2'>
                <CustomInput
                    dataLwtId={option.id}
                    type='checkbox'
                    checked={!option.hide}
                    id={option.id}
                    value={option.id}
                    label={option.label}
                    onClick={handleShowHideOptionsClick}
                />
            </div>
        </>;
    });

    const showHideMetricsColumns = state.showHideColumns?.map(option => {
        return <>
            <div className='py-2'>
                <CustomInput
                    dataLwtId={option.id}
                    type='checkbox'
                    checked={!option?.hide}
                    id={option.id}
                    value={option.id}
                    label={option.label}
                    onClick={handleShowHideOptionsClick} />
            </div>
        </>;
    });

    showHideMetricsList.push(showHideMetricsOptions);
    showHideMetricsList.push(showHideMetricsColumns);

    const isShowOptions = !!(titleContent?.rowCount && hasInitialSearchRun);

    const searchName = state.selectedSearch
        ? state.selectedSearch.savedSearch?.searchName
        : searchTerms.newSearch;

    return (
        <div className='row w-100 ml-2 my-2 pr-1 py-0'>
            <div className='labels-buttons-container'>

                <div className='d-flex align-items-center'>
                    <h4 style={{ marginRight: '10px' }} className='text-truncate mb-0 font-gray-primary'>
                        {marketShareTerms.getSearchSubtitle(searchTypes[location.pathname]?.title)}
                    </h4>
                    <h6 className='text-truncate mb-0 helix-body'>
                        {searchName}
                    </h6>
                </div>

                {isShowOptions &&
                <>
                    <div className='d-flex flex-row' id='market-share-title-row'>
                        <div className='d-flex align-items-center justify-content-center'>
                            <label className='mr-2 clickable'
                                   onClick={handleShowHideChart}>{marketShareTerms.chart}</label>
                            <CustomInput
                                dataLwtId='market-share-chart-toggle'
                                type='switch'
                                id='market-share-chart-toggle'
                                onChange={handleShowHideChart}
                                checked={isShowChart} />
                        </div>
                        {listingTypeOptions?.length && !isComparisonSetView && <Dropdown
                            className='listing-options'
                            dataLwtId='listingTypeOptions'
                            toggleProps={{
                                dataLwtId: 'no-split-toggle',
                                id: 'caret',
                                caret: true,
                                children: titleContent.listingTypes?.find(lt => lt.id === state.listingTypeValue)?.label
                                    || marketShareTerms.listingType,
                                className: 'bg-dark btn btn-sm btn-secondary mr-2'
                            }}
                            items={listingTypeOptions}
                            menuProps={{
                                dataLwtId: 'share-menu',
                                right: true
                            }}
                        />}
                        <Dropdown
                            className='listing-options'
                            dataLwtId='listingViewOptions'
                            toggleProps={{
                                dataLwtId: 'no-split-toggle',
                                id: 'caret',
                                caret: true,
                                children: titleContent.listingViews.find(lv => lv.id === state.listingView)?.label
                                    || marketShareTerms.listingView,
                                className: 'bg-dark btn btn-sm btn-secondary mr-2'
                            }}
                            items={listingViewOptions}
                            menuProps={{
                                dataLwtId: 'share-menu',
                                right: true
                            }}
                        />
                        <OptionsSelector options={showHideMetricsList} />
                        {exportButton}
                    </div>
                </>
                }
            </div>
        </div>
    );
};

TitleRow.propTypes = {
    setListingTypeId: PropTypes.func,
    setListingViewId: PropTypes.func,
    titleContent: PropTypes.object,
    showHideOptions: PropTypes.array,
    updateParentColumns: PropTypes.func,
    isShowChart: PropTypes.bool,
    module: PropTypes.string,
    hasInitialSearchRun: PropTypes.bool,
    handleShowHideChart: PropTypes.func,
    exportButton: PropTypes.element,
    isComparisonSetView: PropTypes.bool,
};

export default TitleRow;
