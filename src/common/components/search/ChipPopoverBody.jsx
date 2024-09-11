import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import FormGroup from '@lwt-helix/form';
import Select from '@lwt-helix/select';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { Input } from '@lwt-helix/controls';
import { InputGroup } from '@lwt-helix/input-group';
import { ListGroup } from '@lwt-helix/list-group';
import { search } from '@lwt-helix/helix-icon/outlined';
import { setStateData } from '../../helpers/state';
import SavedSelection from './SavedSelection';
import { useCommonStore, useSavedAgentsStore } from '../../../store/store';
import { searchTerms, sortingTerms } from '../../../constants';

export default function ChipPopoverBody(props) {
    const {
        listTitle,
        NoItemsComponent,
        initialSelectedItemId,
        getSavedItemName,
        getSavedItemNotes,
        renderTooltip,
        onSelectItem,
        savedGroups,
        handleOpenEditModal,
        filterPlaceholder,
    } = props;

    const { selectedModule } = useCommonStore(({selectedModule}) => ({selectedModule}));

    const sortOptions = [
        { value: sortingTerms.alphaValue, label: sortingTerms.alphaLabel },
        { value: sortingTerms.updatedValue, label: sortingTerms.updatedLabel }
    ];

    const [state, setState] = useState({
        searchText: undefined,
        selectedSortOption: sortOptions[1],
        editableItem: undefined,
        originalItem: undefined,
        overwriteItem: undefined,
        selectedItemId: initialSelectedItemId,
        showEditModal: false,
        showOverwriteModal: false,
        filteredItems: undefined,
    });

    const recentSortFunction = (a, b) => {
        const getMoreRecentDate = object => {
            // TODO: This should be outsourced to the parent of SavedItemDropdown
            if(object?.updatedTs) return new Date(object.updatedTs);
            return new Date(object?.metadata.lastLoadedTs
                ? new Date(object.metadata.lastLoadedTs) > new Date(object.metadata.updatedTs)
                    ? object.metadata.lastLoadedTs
                    : object.metadata.updatedTs
                : object.metadata.updatedTs
            );
        };
        return getMoreRecentDate(b) - getMoreRecentDate(a);
    };

    const alphaSortFunction = (a, b) => {
        // TODO: This should be outsourced to the parent of SavedItemDropdown
        const nameA = (a?.savedSearch?.searchName || a.name);
        const nameB = (b?.savedSearch?.searchName || b.name);
        return nameA.toLowerCase().localeCompare(nameB.toLowerCase(), 'en', { numeric: true });
    };

    const sortList = savedList => Object.keys(savedList).sort().reduce((obj, key) => ({
            ...obj,
            [key]: savedList[key].sort(state.selectedSortOption?.value === sortingTerms.alphaValue ? alphaSortFunction : recentSortFunction)
        }), {});

    useEffect(() => {
        state.selectedItemId !== initialSelectedItemId && onSelectItem(state.selectedItemId);
    }, [state.selectedItemId]);

    const { selectedList } = useSavedAgentsStore(state => ({
        selectedList: state.selectedListByModule[selectedModule],
    }));

    useEffect(() => {
        if (state.filteredItems) {
            setStateData('filteredItems', sortList({ ...state.filteredItems }), setState);
        }
    }, [state.selectedSortOption]);

    useEffect(() => {1
        if (savedGroups && Object.keys(savedGroups).length) {
            let filteredItems;
            if (state.searchText) {
                const filteredKeys = Object.keys(savedGroups).filter(mls =>
                    savedGroups[mls].some(ss => (ss?.name || ss.savedSearch.searchName).toLowerCase().startsWith(state.searchText?.toLowerCase()))
                );
                filteredItems = filteredKeys.reduce((obj, key) => ({
                    ...obj,
                    [key]: savedGroups[key].filter(ss =>
                        (ss?.name || ss.savedSearch.searchName).toLowerCase().startsWith(state.searchText?.toLowerCase())
                    )
                }), {});
            } else {
                filteredItems = { ...savedGroups };
            }
            setStateData('filteredItems', sortList(filteredItems), setState);
        }
    }, [state.searchText, savedGroups]);

    const handleSortChange = option => {
        setStateData('selectedSortOption', option, setState);
    };

    const handleSavedSearchLookup = event => {
        setStateData('searchText', event.target.value, setState);
    };

    const handleChange = (e, itemId) => {
        setStateData('selectedItemId', parseInt(itemId), setState);
        e.preventDefault();
    };

    const SearchIcon = <HelixIcon icon={search} className='align-top mr-1' title='search icon' />;

    const hasItems = savedGroups && Object.keys(savedGroups).length > 0;

    const GroupSelect = () => (
        <div className='py-3' style={{ maxHeight: '450px', overflowY: 'auto' }} key={selectedModule}>
            <FormGroup>
                {Object.keys(state?.filteredItems || {}).map((mls, i)=> {
                    return (
                    <div className='mb-3 mr-2' key={i}>
                        <ListGroup flush>
                            <h6 className='filter-header'>{mls}</h6>
                            {state.filteredItems[mls].map(item =>(
                                <SavedSelection
                                    key={item.id}
                                    savedItem={item}
                                    handleChange={handleChange}
                                    isSelected={
                                        item.id === selectedList?.agentListId
                                            || item.id === state.selectedItemId}
                                    editSavedItem={handleOpenEditModal}
                                    getSavedItemName={getSavedItemName}
                                    getSavedItemNotes={getSavedItemNotes}
                                    renderTooltip={renderTooltip}
                                    handleOpenEditModal={handleOpenEditModal}
                                />
                            ))}
                        </ListGroup>
                    </div>
                )})}
            </FormGroup>
        </div>
    );

    const NoSearchesFound = () => (<div className='text-center py-3'>
        {searchTerms.noSearchesFound}
    </div>);

    return (
        <>
            <div style={{ width: '346px' }}>
                <h3 className="my-3 filter-search-header">{listTitle}</h3>
                {hasItems ? (
                    <div>
                        <div className='d-flex'>
                            <div style={{ width: '70%', marginRight: '3px' }}>
                                <InputGroup
                                    dataLwtId='InputGroup'
                                    style={{ height: '38px' }}
                                    prependAddonProps={[{textProps: { children: SearchIcon }}]}
                                >
                                    <Input
                                        dataLwtId='saved-search-lookup'
                                        onChange={handleSavedSearchLookup}
                                        placeholder={filterPlaceholder}
                                        value={state.searchText}
                                    />
                                </InputGroup>
                            </div>
                            <div style={{ width: '30%' }}>
                                <Select
                                    options={sortOptions}
                                    onChange={handleSortChange}
                                    isClearable={false}
                                    isSearchable={false}
                                    defaultValue={state.selectedSortOption || sortOptions[1]}
                                    className='saved-search-sort'
                                />
                            </div>
                        </div>
                        {hasItems ? <GroupSelect /> : <NoSearchesFound/> }
                    </div>
                ) : (
                    <NoItemsComponent />
                )}
            </div>
        </>
    );
};

ChipPopoverBody.propTypes = {
    listTitle: PropTypes.string,
    NoItemsComponent: PropTypes.node,
    module: PropTypes.string,
    initialSelectedItemId: PropTypes.number,
    toggleEditMode: PropTypes.func,
    getSavedItemName: PropTypes.func,
    getSavedItemNotes: PropTypes.func,
    renderTooltip: PropTypes.func,
    onSelectItem: PropTypes.func,
    savedGroups: PropTypes.object,
    handleOpenEditModal: PropTypes.func,
    filterPlaceholder: PropTypes.string,
};
