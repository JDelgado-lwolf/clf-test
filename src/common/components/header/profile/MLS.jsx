import React, { useEffect, useState } from 'react';
import { Input } from '@lwt-helix/controls';
import { InputGroup } from '@lwt-helix/input-group';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { search } from '@lwt-helix/helix-icon/outlined';

const MLS = (props) => {
    const { mlsList } = props;
    const [filteredMlsList, setFilteredMlsList] = useState();

    useEffect(() => {
        mlsList && setFilteredMlsList(mlsList);
    }, [mlsList]);

    const filterMLS = (event) => {
        const searchText = event.target.value;
        setFilteredMlsList(mlsList.filter((mls) => mls.shortDescription.toLowerCase().startsWith(searchText.toLowerCase())
            || mls.longDescription.toLowerCase().startsWith(searchText.toLowerCase())));
    };

    return (
        <>
            <div style={{ minWidth: '300px' }}>
                <InputGroup dataLwtId='InputGroup'
                            style={{ height: '36px' }}
                            prependAddonProps={[{
                                textProps: {
                                    children: <HelixIcon icon={search} className='align-top' title='search icon' />
                                }
                            }]}>
                    <Input dataLwtId='mlsSearch' onChange={filterMLS} placeholder='Search MLS name' />
                </InputGroup>
            </div>
            {filteredMlsList
            && <div style={{ minWidth: '300px' }}>
                <label className='mt-2'>MLS NAME</label>
                <ul className='mls-list'>
                    {filteredMlsList.map(mls => {
                        return <li className={!mls.isActive && 'text-muted'}>
                            {mls.shortDescription} ({mls.longDescription}){!mls.isActive && ' (INACTIVE)'}
                        </li>;
                    })
                    }
                </ul>
            </div>
            }
        </>
    );
};

export default MLS;

