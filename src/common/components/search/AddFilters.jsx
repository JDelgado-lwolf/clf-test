import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Popover from '@lwt-helix/popover';
import Select from '@lwt-helix/select';
import { Button } from '@lwt-helix/buttons';
import Icon from '@lwt-helix/icon';
import { HelixIcon } from '@lwt-helix/helix-icon';
import {
    agent,
    bathtub,
    bed,
    building_modern,
    clock,
    coin,
    home,
    home_chart,
    map_pin,
    search,
    sign_in_ground,
    sign_sold,
    box_size,
    lot,
    circle_info,
    home_compare
} from '@lwt-helix/helix-icon/outlined';
import Tooltip from '@lwt-helix/tooltip';
import Filter from './filters/Filter';
import { agentProductionTerms as apt, buttonTerms, searchTerms as st } from '../../../constants';
import { popoverModifiers } from '../../helpers/search';
import { useCloseChip } from './chips/hooks/closeChip';
import { setStateData } from '../../helpers/state';
import { getFilterGroups } from '../../helpers/filter-list';
import { useFeatureToggles } from '../../hooks/featureToggles';

const iconProps = (icon, iconName) => {
    return {
        icon,
        title: `${iconName} icon`,
        className: 'align-bottom mr-1'
    };
};

const icons = {
    mls: <HelixIcon {...iconProps(home_chart, st.mls)} />,
    propertyType: <HelixIcon {...iconProps(home, st.propertyType)} />,
    areaType: <HelixIcon {...iconProps(map_pin, st.areaType)} />,
    timeFrame: <HelixIcon {...iconProps(clock, st.timeFrame)} />,
    marketArea: <HelixIcon {...iconProps(map_pin, st.marketArea)} />,
    totalVolume: <HelixIcon {...iconProps(coin, st.totalVolume)} />,
    soldPriceRange: <HelixIcon {...iconProps(coin, st.soldPriceRange)} />,
    priceRange: <HelixIcon {...iconProps(coin, st.priceRange)} />,
    totalUnits: <HelixIcon {...iconProps(sign_in_ground, st.totalUnits)} />,
    fullBathrooms: <HelixIcon {...iconProps(bathtub, st.fullBathrooms)} />,
    bedrooms: <HelixIcon {...iconProps(bed, st.bedrooms)} />,
    listingStatus: <HelixIcon {...iconProps(sign_sold, st.listingStatus)} />,
    offices: <HelixIcon {...iconProps(building_modern, st.offices)} />,
    agents: <HelixIcon {...iconProps(agent, st.agents)} />,
    squareFootage: <HelixIcon {...iconProps(box_size, apt.squareFootage)} />,
    lotSize: <HelixIcon {...iconProps(lot, apt.lotSize)} />,
    comparisonSet: <HelixIcon {...iconProps(home_compare, st.comparisonSet)} />
};

const AddFilters = props => {
    const { toggleFilter, disabled, searchObj, module, mlsMembershipInfo } = props;

    const featureToggles = useFeatureToggles();
    const [state, setState] = useState({
        isPopoverOpen: false,
        isComparisonSetsEnabled: featureToggles.comparisonSets.isEnabled
    });

    useCloseChip(state.isPopoverOpen, setState);

    const handleUserKeyPress = useCallback(event => {
        const { keyCode, target } = event;
        if (keyCode === 191 && !['input', 'select', 'textarea'].includes(target.tagName.toLowerCase())) {
            togglePopover();
            event.preventDefault();
        }
    }, [state.isPopoverOpen]);

    useEffect(() => {
        if (disabled === false) {
            window.addEventListener('keydown', handleUserKeyPress);
        }
        return () => {
            window.removeEventListener('keydown', handleUserKeyPress);
        };
    });

    const togglePopover = () => setStateData('isPopoverOpen', !state.isPopoverOpen, setState)

    const selectFilter = filter => {
        toggleFilter(filter);
        togglePopover();
    };

    const selectDropdownOption = e => {
        selectFilter(e.value);
    };

    const groupStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    };

    const formatGroupLabel = data => (
        <div style={groupStyles}>
            <span>{data.label}</span>
        </div>
    );

    const getIsFilterDisabled = (filter) => {
        if (filter.id === st.squareFootageFilter) {
            return !mlsMembershipInfo?.supportsSquareFootage;
        }
        return filter.id === st.lotSizeFilter &&
            mlsMembershipInfo?.supportsLotSizeAcres === false &&
            mlsMembershipInfo?.supportsLotSizeSqft === false;
    };

    const getMlsNotSupportIconTooltip = (filter) => {
        if (filter.id === st.squareFootageFilter ||
            filter.id === st.lotSizeFilter) {
            if (getIsFilterDisabled(filter)) {
                return <>
                    <div id={`${filter.id}-icon`} className='d-flex align-items-center'>
                        <HelixIcon icon={circle_info} />
                    </div>
                    <div>
                        <Tooltip target={`${filter.id}-icon`}>
                            {st.mlsNotSupportMeasureType(filter.name)}
                        </Tooltip>
                    </div>
                </>;
            }
        }
    };

    const filterGroups = useMemo(()=> {
        return getFilterGroups({ isComparisonSetsEnabled: featureToggles.comparisonSets.isEnabled });
    }, [featureToggles.comparisonSets.isEnabled]);

    return (<>
        <Button
            dataLwtId='add-filters'
            size='sm'
            color='light'
            className='mb-1 text-capitalize d-inline-flex align-items-center'
            id='add-filters'
            disabled={disabled}
        >
            <Icon className='mr-1 text-primary' iconName='add_circle' dataLwtId='add-icon' />
            {buttonTerms.addFilter}
        </Button>
        <Popover
            target='add-filters'
            placement='bottom'
            trigger='legacy'
            size='auto'
            isOpen={state.isPopoverOpen}
            toggle={togglePopover}
            disabled={disabled}
            style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', minWidth: '220px' }}
            body={<>
                <div className='d-flex mt-1 mb-2'>
                    <span className='mr-auto filter-header'>Shortcut</span>
                    <div className='rounded btn-secondary bg-dark mx-1 d-flex align-items-center justify-content-center'
                         style={{ width: '1.5em', height: '1.5em' }}>
                        <span className='helix-body--strong'>/</span>
                    </div>
                </div>
                <Select
                    placeholder={
                        <>
                            <HelixIcon icon={search} className='align-top mr-2' title='search icon' />Search filters
                        </>
                    }
                    isClearable={false}
                    formatGroupLabel={formatGroupLabel}
                    options={filterGroups.map(group => {
                        return {
                            label: group.title,
                            options: group.filters.filter(f => !module || f.modules.includes(module)).map(f => ({
                                label: f.name?.[module] || f.name,
                                value: f.id
                            }))
                        };
                    })}
                    className='mb-2 mt-1'
                    onChange={selectDropdownOption}
                    onlySearchLabel={true}
                    autoFocus={true}
                />
                {filterGroups.map(group => {
                    return (<>
                        <span className='mr-auto filter-header mb-1'>{group.title}</span>
                        {group.filters.filter(filter => !module || filter.modules.includes(module)).map(filter => {
                            return <div className='d-flex'>
                                <Filter
                                    id={filter.id}
                                    name={filter.name?.[module] || filter.name}
                                    icon={icons[filter.id]}
                                    search={searchObj}
                                    onClick={selectFilter}
                                    permanent={filter.permanent}
                                    disabled={getIsFilterDisabled(filter)}
                                    mlsMembershipInfo={mlsMembershipInfo} />

                                {getMlsNotSupportIconTooltip(filter)}
                            </div>;
                        })}
                        <hr className='my-2' />
                    </>);
                })}
            </>
            }
            {...popoverModifiers}
        />
    </>);
};

export default AddFilters;
