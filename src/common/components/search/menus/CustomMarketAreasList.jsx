import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash-es';
import FormGroup from '@lwt-helix/form';
import { Input } from '@lwt-helix/controls';
import { Button } from '@lwt-helix/buttons';
import { InputGroup } from '@lwt-helix/input-group';
import { ListGroup, ListGroupItem } from '@lwt-helix/list-group';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { search, pencil } from '@lwt-helix/helix-icon/outlined';
import { setStateData } from '../../../helpers/state';
import { areaRequestTypes, searchTerms } from '../../../../constants';
import { modalKeys } from '../../../helpers/menu';
import { chipIconProps } from '../../../helpers/chips';

const CustomMarketAreasList = props => {
    const {
        mlsId,
        marketAreaLists,
        showEditModal,
        setSelectedMarketAreaList,
        mappedAreas
    } = props;

    const [isHovering, setIsHovering] = useState(false);
    const [state, setState] = useState({
        lists: undefined,
        filteredLists: undefined
    });

    useEffect(async () => {
        if (mlsId) {
            const lists = marketAreaLists?.filter(list => list.mlsId === mlsId).filter(a => !isEmpty(a.elements));
            lists && setStateData('lists', lists, setState);
        }
    }, [mlsId, marketAreaLists]);

    useEffect(() => {
        filterLists();
    }, [state.lists]);

    const filterLists = searchText => {
        if (state.lists) {
            const filteredLists = searchText
                ? [...state.lists].filter(a =>
                    a.name.toLowerCase().includes(searchText.toLowerCase())
                    || a.elements.fieldTypeName.toLowerCase().startsWith(searchText.toLowerCase())
                )
                : [...state.lists];
            setStateData('filteredLists', filteredLists, setState);
        }
    };

    const toggleEditIcon = list => {
        setIsHovering(list ? { [list.id]: true } : {});
    };

    const selectMarketAreaList = (e, list) => {
        setSelectedMarketAreaList(list);
        e.preventDefault();
    };

    return <div>
        {mappedAreas && state.lists && state.lists.length > 0 &&
        <>
            <div style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#687280',
                textTransform: 'uppercase',
                marginTop: '5px',
                marginBottom: '5px',
                paddingTop: '10px',
                borderTop: '1px solid gainsboro'
            }}>
                {searchTerms.myMarketLists}
            </div>
            <InputGroup dataLwtId='custom-area-filter'
                        style={{ height: '38px' }}
                        prependAddonProps={[{
                            textProps: {
                                children: <HelixIcon icon={search} className='align-top mr-1'
                                                     title='search icon' />
                            }
                        }]}>
                <Input
                    dataLwtId='custom-area-lists-lookup'
                    onChange={e => filterLists(e.target.value)}
                    placeholder={searchTerms.marketAreaFilterPlaceholder}
                />
            </InputGroup>
            <div style={{ maxHeight: '200px', overflowY: 'auto', maxWidth: '400px' }}
                 className='mt-2'>
                <FormGroup>
                    <ListGroup flush>
                        {state.filteredLists?.map(list => {
                                const areaLabel = Object.values(mappedAreas).find(mappedArea =>
                                    areaRequestTypes[mappedArea.columnName] === list.elements.fieldName
                                )?.viewName;
                                return (
                                    <div
                                        onMouseOver={() => toggleEditIcon(list)}
                                        onMouseOut={() => toggleEditIcon()}
                                        style={{
                                            width: '100%',
                                            outlineColor: 'transparent',
                                            zIndex: 0,
                                            overflowX: 'hidden'
                                        }}
                                    >
                                        <div style={{ width: '90%', float: 'left' }}>
                                            <ListGroupItem
                                                className='chip-option'
                                                tag='button'
                                                onClick={(e) => selectMarketAreaList(e, list)}
                                                style={{ whiteSpace: 'pre-wrap' }}
                                            >
                                                {`${list.name} (${areaLabel})`}
                                            </ListGroupItem>
                                        </div>
                                        <div
                                            style={{
                                                width: '10%',
                                                float: 'right',
                                                paddingTop: '8.5px',
                                                display: isHovering[list.id] ? 'block' : 'none'
                                            }}
                                        >
                                            <Button
                                                dataLwtId={`edit-icon-${list.id}`}
                                                size='sm'
                                                color='link'
                                                onClick={() => showEditModal(modalKeys.dropdown, list.id)}
                                            >
                                                <HelixIcon icon={pencil} {...chipIconProps} title='edit icon' />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </ListGroup>
                </FormGroup>
            </div>
        </>}
    </div>;
};

export default CustomMarketAreasList;
