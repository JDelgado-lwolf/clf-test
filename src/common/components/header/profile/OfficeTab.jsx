import React, { useEffect, useState } from 'react';
import Select from '@lwt-helix/select';
import { Input, Label } from '@lwt-helix/controls';
import { InputGroup } from '@lwt-helix/input-group';
import Badge from '@lwt-helix/badge';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { search } from '@lwt-helix/helix-icon/outlined';
import { useCommonStore } from '../../../../store/store';

const OfficeTab = (props) => {
    const { mlsList } = props;
    const [mlsOptions, setMlsOptions] = useState();
    const [officeList, setOfficeList] = useState();
    const [selectedMls, setSelectedMls] = useState({});
    const [searchText, setSearchText] = useState(undefined);

    const {
        profile,
        officeInfo,
        getOfficeInfo,
        getAgentInfo,
        agentInfo
    } = useCommonStore(state => ({
        profile: state.profile,
        officeInfo: state.officeInfo,
        getOfficeInfo: state.getOfficeInfo,
        getAgentInfo: state.getAgentInfo
    }));

    useEffect(() => {
        if (mlsList) {
            const selectOptions = mlsList.map(mls => ({
                id: mls.mlsId,
                value: mls.shortDescription,
                label: mls.longDescription
            }));
            setMlsOptions(selectOptions);
            setSelectedMls(selectOptions[0]);
        }
    }, [mlsList]);


    useEffect(async () => {
        if (profile) {
            if (!!profile.accessibleOfficeList?.length) {
                // BME user
                await getOfficeInfo(profile.accessibleOfficeList);
            } else {
                //  BMO user
                await getAgentInfo(profile.agentList);
            }
        }
    }, [profile]);

    useEffect(async () => {
        if (!agentInfo || !agentInfo.length) return;
        await getOfficeInfo(agentInfo.map(agent => agent.office));
    }, [agentInfo]);

    useEffect(() => {
        officeInfo && setOfficeList(officeInfo.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase())));
    }, [officeInfo]);

    const filterOffice = event => {
        setSearchText(event.target.value.toUpperCase());
    };

    const handleChange = event => {
        setSelectedMls(event);
    };

    return (
        <div style={{ minWidth: '300px' }}>
            {
                mlsList && !mlsList?.length &&
                <div> You do not have an MLS associated with your account. Please contact our Customer Support at <a
                    href='mailto:terradatum.support@lwolf.com'>terradatum.support@lwolf.com</a> or call <a
                    href='tel:888.212.4793'>888-212-4793</a>.
                </div>
            }
            {
                !!mlsOptions?.length &&
                <>
                    <Label dataLwtId='mls-select-label' for='mls-select'>MLS</Label>
                    <Select dataLwtId='mls-select'
                            id='mls-select'
                            className='mb-2 w-100'
                            type='select'
                            value={selectedMls}
                            onChange={handleChange}
                            placeholder={
                                <>
                                    <HelixIcon icon={search} className='align-top mr-1'
                                               title='search icon' />Select an MLS
                                </>
                            }
                            options={mlsOptions}
                            matchFrom='start'
                            autoFocus={true}
                            isClearable={false}
                    />
                    {
                        !officeList?.length
                            ? <></>
                            : <>
                                <InputGroup dataLwtId='InputGroup'
                                            style={{ height: '36px' }}
                                            prependAddonProps={[{
                                                textProps: {
                                                    children: <HelixIcon icon={search} className='align-top mr-1'
                                                                         title='search icon' />
                                                }
                                            }]}>
                                    <Input dataLwtId='officeSearch' onChange={filterOffice}
                                           placeholder='Search Office Name or ID' />
                                </InputGroup>
                                <div style={{
                                    width: '100%',
                                    maxHeight: '278px',
                                    overflow: 'auto',
                                    borderTop: '1px solid #ccc',
                                    marginTop: '1rem'
                                }}>
                                    {officeList
                                        .filter(o => o.mlsOfficeId.mlsId === selectedMls.id)
                                        .filter(o =>
                                            !searchText || o.name.toUpperCase().startsWith(searchText)
                                            || o.mlsOfficeId.officeId.toUpperCase().startsWith(searchText)
                                        )
                                        .map(o => {
                                            return (
                                                <div>
                                                    <div style={{ marginTop: '1rem' }}>
                                                        <div className='font-weight-bold'>{o.name}
                                                            {!o.isOfficeActive &&
                                                            <Badge color='info' className={'ml-2'}>Inactive</Badge>}
                                                        </div>
                                                        <div>{
                                                            `${o?.address?.street1}, ${o?.address?.city}, ` +
                                                            `${o?.address?.stateCode} ${o?.address?.zipCode}`
                                                        }
                                                        </div>
                                                        <div>
                                                            Office
                                                            ID: {o.mlsOfficeId.officeId} {(o.phoneList && o.phoneList.length) ? `| ${o.phoneList[0].phoneNumber}` : ''}
                                                        </div>
                                                        <div>{selectedMls.label}</div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </>
                    }
                </>
            }
        </div>
    );
};

export default OfficeTab;
