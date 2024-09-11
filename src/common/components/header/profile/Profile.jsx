import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import Tab from '@lwt-helix/tab';
import Account from './Account';
import MLS from './MLS';
import { setStateData } from '../../../helpers/state';
import OfficeTab from './OfficeTab';
import { useCommonStore } from '../../../../store/store';
import ComparisonSets from '../../../../comparison-sets/ComparisonSets';
import { agentProductionTerms as apt, marketShareTerms as mst, navTerms } from '../../../../constants';
import { getOwnerIdByTokenInfo, userNameByTokenType } from '../../../../constants/auth';
import { useAuthStore } from '../../../../store/auth/store';
import { useFeatureToggles } from '../../../hooks/featureToggles';

const Profile = ({ userAccounts, isMarketShareAllowed }) => {
    const [state, setState] = useState({});
    const history = useHistory();
    const featureToggles = useFeatureToggles();
    const defaultSortFunction = (a, b) => a.shortDescription.localeCompare(b.shortDescription);

    const { membership } = useCommonStore(({ membership }) => ({ membership }));

    const {
        tokenInfo,
        tokenType,
    } = useAuthStore(state => ({
        tokenInfo: state.tokenInfo,
        tokenType: state.tokenType,
    }));

    const ownerId = tokenType && getOwnerIdByTokenInfo[tokenType](tokenInfo);

    const toggleActiveTab = index => {
        let searchParams = new URLSearchParams(history.location.search);
        searchParams.set('selectedTab', index);
        history.push({
            pathname: history.location.pathname,
            search: searchParams.toString()
        });
    };

    useEffect(() => {
        if (!tokenInfo || !tokenType) return;
        setState({
            ...state,
            profile: {
                id: ownerId,
                firstName: userAccounts ? userAccounts.user.firstName : tokenInfo.given_name,
                lastName: userAccounts ? userAccounts.user.lastName : tokenInfo.family_name,
                username: userNameByTokenType(tokenInfo)[tokenType],
                email: userAccounts ? userAccounts.user.email : tokenInfo.email
            }
        });
    }, [tokenInfo, tokenType]);

    useEffect(() => {
        if (!!membership?.length) {
            const mlsList = membership.sort(defaultSortFunction)
            setStateData('mlsList', mlsList, setState);
            // We could progressively switch from the local state to this
            useCommonStore.setState({ mlsList});
        }
    }, [membership]);

    useEffect(() => {
        const qs = queryString.parse(history.location.search);
        const selectedTab = qs?.selectedTab && parseInt(qs.selectedTab);
        selectedTab && setStateData('currentIndex', selectedTab, setState);
    }, []);

    const getActiveTab = () => {
        const qs = queryString.parse(history.location.search);
        return qs?.selectedTab ? parseInt(qs.selectedTab) : 0;
    };

    const getTabItems = () => {
        const items = [
            {
                title: apt.account,
                content: {
                    jsx: <Account profile={state.profile} />,
                    className: 'raised-border bg-white p-4'
                }
            },
            {
                title: apt.office,
                content: {
                    jsx: <OfficeTab profile={state.profile} mlsList={state.mlsList} />,
                    className: 'raised-border bg-white p-4'
                }
            },
            {
                title: apt.mls,
                content: {
                    jsx: <MLS mlsList={state.mlsList} />,
                    className: 'raised-border bg-white p-4'
                }
            },
        ];

        if (!isMarketShareAllowed ||
            !featureToggles.comparisonSets.isEnabled) return items;

        const comparisonSetsItem= {
            title: mst.comparisonSets,
            content: {
                jsx: <ComparisonSets />,
            }
        };

        items.push(comparisonSetsItem);
        return items;
    };

    return (
        <>
            <div style={{ margin: '15px 10px 0' }}>
                <h3 className='text-center mb-0 font-weight-bold'>{navTerms.myProfile}</h3>
            </div>
            <div style={{ margin: '5px auto', padding: '0 20px' }}
                 className='col-xl-4 col-lg-5 col-md-7 col-sm-10 col-xs-12'>
                <Tab style={{ margin: '5px auto 10px' }}
                     tabTextTransform='none'
                     contentSize={6}
                     navSize={6}
                     items={getTabItems()}
                     tabs
                     currentIndex={getActiveTab()}
                     setCurrentIndex={toggleActiveTab}
                />
            </div>
        </>
    );
};

export default Profile;
