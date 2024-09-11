import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Tab from '@lwt-helix/tab';
import { Row } from '@lwt-helix/layout';
import Loader from '@lwt-helix/loader';
import AgentContactInfo from '../../../../agentSlideout/AgentContactInfo';
import { agentProductionTerms } from '../../../../../../constants';
import PropertyInformation from './tabs/PropertyInformation';
import PricingHistory from './tabs/PricingHistory';
import { useQuery } from '../../../../../../common/hooks/location';
import { setStateData } from '../../../../../../common/helpers/state';
import { mapIdToTableData } from '../../../../../helpers/dataFormatters';
import { getFirstToolRoute } from '../../../../../../common/helpers/routes';
import { useCommonStore, useSearchStore } from '../../../../../../store/store';
import { getListingDetailRequest, getListingHistoryRequest } from '../../../../../../service/service-gateway';

const ListingInformationPage = ({ agentData, module }) => {
    const history = useHistory();
    let query = useQuery();
    const queryTabIndex = query.get('tabIndex');
    const displayMode = query.get('displayMode');
    const intervalType = query.get('intervalType');
    const tabIndex = Object.freeze({
        LISTING_INFORMATION: 0,
        PRICING_HISTORY: 1
    });

    const {
        search,
        loadedSearchCriteria
    } = useSearchStore(state => ({
        search: state[module]?.search,
        loadedSearchCriteria: state[module]?.loadedSearchCriteria
    }));

    const {
        membership
    } = useCommonStore(state => ({
        membership: state.membership
    }));

    const [state, setState] = useState({
        agent: null,
        agentsData: null,
        mlsNum: query.get('mlsNum'),
        mlsId: null,
        agentId: query.get('agentId'),
        currentTabIndex: tabIndex.LISTING_INFORMATION,
        searchCriteria: null,
        mlsName: null
    });
    const setCurrentTabIndex = (currentTabIndex) => {
        setState({
            ...state,
            currentTabIndex
        });
    };

    const [listingDetailData, setListingDetailData] = useState(null);
    const [listingHistoryData, setListingHistoryData] = useState(null);

    const redirectToHome = () => {
        window.location.href = getFirstToolRoute();
    };

    const shouldRender = !!module;

    useEffect(() => {
        if (!shouldRender) return;

        if (!state.mlsNum || !state.mlsId) return;

        const loadDetailData = async () => {
            let error = null;
            const response = await getListingDetailRequest(state.mlsNum, state.mlsId);
            if (!response) {
                redirectToHome();
                return;
            }
            if (response.error) {
                console.error('Listing Information error:', error);
                redirectToHome();
                return;
            }
            setListingDetailData(response);
        };

        const detailError = (e) => console.log(e);

        loadDetailData().catch(detailError);

        const loadHistoryData = async () => {
            let error = null;
            const response = await getListingHistoryRequest(state.mlsNum, state.mlsId);
            if (!response) {
                redirectToHome();
                return;
            }
            if (response.error) {
                console.error('Listing Information error:', error);
                redirectToHome();
                return;
            }
            setListingHistoryData(response);
        };

        const historyError = (e) => console.log(e);

        loadHistoryData().catch(historyError);
    }, [state.mlsId, state.mlsNum]);

    const mlsProviders = useRef([]);

    useEffect(() => {
        if (agentData) {
            const revisedData = mapIdToTableData(agentData);
            setStateData('agentsData', revisedData || [], setState);
        }
    }, [agentData]);

    useEffect(() => {
        if (!shouldRender) {
            history.push('/');
        }
    }, []);

    useEffect(() => {
        if (!loadedSearchCriteria?.realEstateDatasourceIdsWithFilters?.length) return;
        setStateData(
            'mlsId',
            loadedSearchCriteria.realEstateDatasourceIdsWithFilters[0].realEstateDatasourceId,
            setState
        );
        setStateData('searchCriteria', loadedSearchCriteria, setState);
    }, [loadedSearchCriteria]);

    useEffect(() => {
        mlsProviders.current = membership;
    }, [membership]);

    useEffect(() => {
        if (!shouldRender) return;
        if (search.mlsId && mlsProviders.current) {
            const mlsName = mlsProviders.current.find(
                (p) => p?.mlsId === search.mlsId
            )?.shortDescription;
            setStateData('mlsName', mlsName, setState);
        }
    }, [mlsProviders.current, search]);

    useEffect(() => {
        if (!shouldRender) return;
        if (state.agentsData != null) {
            const agentFound = state.agentsData.find((agent) => agent.agentId === state.agentId);
            if (!agentFound) {
                redirectToHome();
                return;
            }
            setStateData('agent', agentFound, setState);
        }
    }, [state.agentsData, state.agentId]);

    if (!shouldRender) return (<></>);

    return (
        <>
            <Row className={'m-1 mb-2'}>
                {!state.agent
                    ? <Loader />
                    : <AgentContactInfo
                        agent={state.agent}
                        index={queryTabIndex}
                        displayMode={displayMode}
                        intervalType={intervalType}
                        module={module}
                    />
                }
            </Row>
            <div className='content mt-2 pb-3 flex-grow-0'>
                {!listingDetailData
                    ? <Loader />
                    : <>
                        <h4 className='helix-display-small'>
                            {listingDetailData.address}
                        </h4>
                        <div>
                            {listingDetailData.city}, {listingDetailData.state} {listingDetailData.zipCode}{' '}
                            {listingDetailData.county}
                        </div>
                    </>
                }
            </div>
            <div className={'width-100'}>
                {!listingDetailData
                    ? <Loader />
                    : <>
                        <Tab
                            tabTextTransform='none'
                            navSize={2}
                            contentSize={2}
                            className='secondary'
                            items={[
                                {
                                    title: agentProductionTerms.propertyInformation,
                                    content: {
                                        jsx: <PropertyInformation data={listingDetailData} module={module}
                                                                  mlsName={state.mlsName} />
                                    }
                                },
                                {
                                    title: agentProductionTerms.pricingHistory,
                                    content: {
                                        jsx: <PricingHistory data={listingHistoryData} />
                                    }
                                }
                            ]}
                            tabs
                            currentIndex={state.currentTabIndex}
                            setCurrentIndex={setCurrentTabIndex}
                        />
                    </>
                }
            </div>
        </>
    );
};


ListingInformationPage.propTypes = {
    module: PropTypes.string
};

export default ListingInformationPage;
