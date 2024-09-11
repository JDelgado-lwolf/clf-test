import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Dropdown } from '@lwt-helix/dropdown';
import { Row } from '@lwt-helix/layout';
import Loader from '@lwt-helix/loader';
import { useURIDecoder } from '../helpers/helpers';
import { setStateData } from '../../common/helpers/state';
import { getFirstToolRoute } from '../../common/helpers/routes';
import { agentProductionTerms as apt } from '../../constants';
import { useQuery } from '../../common/hooks/location';
import PropertyInformation
    from '../../agent-production/components/agentProfile/tabs/inventory/listingInformationPage/tabs/PropertyInformation';
import PricingHistory
    from '../../agent-production/components/agentProfile/tabs/inventory/listingInformationPage/tabs/PricingHistory';
import TitleInfo from './common/TitleInfo';
import { useSearchStore, useCommonStore } from '../../store/store';
import { getListingDetailRequest, getListingHistoryRequest } from '../../service/service-gateway';

const ListingInformation = ({ module }) => {
    const history = useHistory();
    let query = useQuery();

    const {
        loadedSearchCriteria
    } = useSearchStore(state => ({
        loadedSearchCriteria: state[module]?.loadedSearchCriteria
    }));

    const { mlsProviders } = useCommonStore();

    const [state, setState] = useState({
        listingDetailData: null,
        listingHistoryData: null,
        listingView: apt.propertyInformation,
        listingViews: [apt.propertyInformation, apt.pricingHistory],
        mlsId: null,
        mlsName: undefined,
        mlsNum: query.get('mlsNum')
    });
    const title = useURIDecoder('address');

    const listingViewOptions = state.listingViews?.map(option => {
        return {
            dataLwtId: option,
            itemText: option,
            key: option,
            onClick: () => {
                setStateData('listingView', option, setState);
            }
        };
    });

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
            setStateData('listingDetailData', response, setState);
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
            setStateData('listingHistoryData', response, setState);
        };

        const historyError = (error) => console.log(error);

        loadHistoryData().catch(historyError);
    }, [state.mlsId, state.mlsNum]);

    useEffect(() => {
        if (!shouldRender) {
            history.push('/');
        }
    }, []);

    useEffect(() => {
        if (!loadedSearchCriteria?.realEstateDatasourceIdsWithFilters?.length) return;
        setStateData(
            'mlsId',
            loadedSearchCriteria.realEstateDatasourceIdsWithFilters[0]
                .realEstateDatasourceId,
            setState
        );
    }, [loadedSearchCriteria]);

    useEffect(() => {
        const mlsName = mlsProviders?.find(mls => mls?.mlsId === state.mlsId)?.shortDescription;
        setStateData('mlsName', mlsName, setState);
    }, [mlsProviders, state.mlsId]);

    if (!shouldRender) return (<></>);

    let subtitle = state.listingView;

    if (state.listingDetailData) {
        const ldd = state.listingDetailData;
        subtitle = `${ldd?.address} ${ldd?.city}, ${ldd?.state} ${ldd?.zipCode} ${ldd?.county}`;
    }

    return <>
        <Row className='mr-0 m-1 mb-2'>
            <TitleInfo title={title} subtitle={subtitle} />
            <div className='ml-auto d-flex w-auto align-self-center'>
                <Dropdown
                    className='listing-options'
                    dataLwtId='listingViewOptions'
                    toggleProps={{
                        dataLwtId: 'no-split-toggle',
                        id: 'caret',
                        caret: true,
                        children: state.listingView
                    }}
                    items={listingViewOptions}
                    menuProps={{
                        dataLwtId: 'share-menu',
                        right: true
                    }}
                />
            </div>

        </Row>
        {state.listingDetailData && state.listingHistoryData
            ? state.listingView === apt.propertyInformation
                ? <PropertyInformation data={state.listingDetailData} module={module} mlsName={state.mlsName}/>
                : <PricingHistory data={state.listingHistoryData} />
            : <Loader />
        }
    </>;
};

ListingInformation.propTypes = {
    module: PropTypes.string
};

export default ListingInformation;
