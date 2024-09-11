import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Icon from '@lwt-helix/icon';
import { Button } from '@lwt-helix/buttons';
import AgentNameBlock from './AgentNameBlock';
import { agentProductionTerms, moduleRoutes } from '../../../constants';
import { useQuery } from '../../../common/hooks/location';
import { Routes } from '../../../common/routes/routes';
import { agentProfileRoute, agentProfileTabs } from '../../constants/agentProductionConstants';
import { unmaskUrlVar } from '../../../common/helpers/routes';
import { useCommonStore, useSearchStore } from '../../../store/store';

const AgentContactInfo = (props) => {
    const { agent, index, statusType, isUnits, intervalType, areaType, displayMode, module } = props;

    const setSelectedModule = useSearchStore(state => state.setSelectedModule);

    const {
        agentId,
        officeAddress,
        officeCity,
        officeState,
        officeZipCode,
        agentEmail,
        agentPhone1,
        agentPhone2
    } = agent ?? {};
    const history = useHistory();
    const query = useQuery();

    const anchorElements = {
        agentEmail: agentEmail ? (
            <a href={`mailto:${agentEmail}`}>{agentEmail}</a>
        ) : (
            agentProductionTerms.notApplicableAbbrv
        ),
        agentPhone1: agentPhone1 ? (
            <a href={`tel:${agentPhone1.split(' ')[0]}`}>{agentPhone1}</a>
        ) : (
            agentProductionTerms.notApplicableAbbrv
        ),
        agentPhone2: agentPhone2 ? (
            <a href={`tel:${agentPhone2.split(' ')[0]}`}>{agentPhone2}</a>
        ) : (
            agentProductionTerms.notApplicableAbbrv
        )
    };

    const agentProductionListingRoute = `${Routes.PROF_METRICS.BASE}${Routes.PROF_METRICS.PROD_LISTING}`;
    const agentListingInfoRoute = `${Routes.PROF_METRICS.BASE}${Routes.PROF_METRICS.LISTING_INFO}`;

    const handleBackClick = async () => {
        const graphModeParam = query.get('graph');
        const chartModeParam = query.get('chartMode');
        const period = query.get('period');
        const tabIndex = query.get('tabIndex');
        const queryIsShowBarLabels = query.get('isShowBarLabels');
        let location = Routes.PROF_METRICS.BASE;
        let pathname = window.location.pathname;
        const selectedArea = unmaskUrlVar(query.get('selectedArea'));

        if (query.get('incomingPage') === Routes.PROF_METRICS.COVERAGE_LISTING) {
            history.push({
                pathname: `${Routes.PROF_METRICS.BASE}${Routes.PROF_METRICS.COVERAGE_LISTING}`,
                state: {
                    selectedArea,
                    agent,
                    displayMode
                }
            });
        } else if (period && pathname === agentListingInfoRoute) {
            location = `${agentProductionListingRoute}?id=${agentId}`
                + `&period=${period}`
                + `&tabIndex=${tabIndex || ''}`
                + `&graph=${graphModeParam}`
                + `&chartMode=${chartModeParam}`
                + `&isShowBarLabels=${queryIsShowBarLabels}`
                + `&intervalType=${intervalType}`;
            return history.push(location);
        } else if (pathname === agentProfileRoute) {
            await setSelectedModule(module);
            return history.push(moduleRoutes[module]);
        } else if (index < agentProfileTabs.TRANSACTION_COVERAGE) {
            location = `${agentProfileRoute}?id=${agentId}`
                + `&tabIndex=${index}&graph=${graphModeParam || ''}`
                + `&chartMode=${chartModeParam || ''}`
                + `&graphStatusType=${statusType || ''}`
                + `&isShowBarLabels=${queryIsShowBarLabels}`
                + `&timeInterval=${intervalType}`;
            history.push(location);
        } else if (index === agentProfileTabs.TRANSACTION_COVERAGE) {
            location = `${agentProfileRoute}?id=${agentId}&tabIndex=${index}&graphStatusType=${statusType}&isUnits=${isUnits}&timeInterval=${intervalType}&areaType=${areaType}&displayMode=${displayMode}`;
            history.push(location);
        } else {
            history.push(location);
        }
    };

    return (
        <div>
            <div className='d-flex flex-row mr-2'>
                <Button
                    dataLwtId='back-button'
                    color='secondary'
                    size='lg'
                    className='bg-dark p-1 d-flex align-self-stretch align-items-center'
                    onClick={handleBackClick}
                >
                    <Icon className='mr-1' iconName='navigate_before' dataLwtId='previous-icon' />
                </Button>
                <div className='d-flex'>
                    <AgentNameBlock selectedAgent={agent} />
                    <div className='d-flex helix-body ml-4 mb-2 flex-column'>
                        <span>
                            Agent ID: {agentId ?? agentProductionTerms.notApplicableAbbrv}
                        </span>
                        <span>
                            <Icon
                                dataLwtId='mail-icon'
                                className='mr-1'
                                iconName='forward_to_inbox'
                            />
                            {anchorElements.agentEmail}
                        </span>
                        <span>
                            <Icon dataLwtId='phone-icon' className='mr-1' iconName='phone' />
                            {anchorElements.agentPhone1}
                        </span>
                    </div>
                    <div className='d-flex helix-body ml-4 mb-2 flex-column'>
                        <span>
                            <Icon dataLwtId='apt-icon' className='mr-1' iconName='apartment' />
                            {officeAddress || officeCity || officeState || officeZipCode ?
                                <>
                                    <span>{officeAddress ?? agentProductionTerms.notApplicableAbbrv},&nbsp;</span>
                                    <span>{officeCity ?? agentProductionTerms.notApplicableAbbrv},&nbsp;</span>
                                    {officeState?.length > 1 ?
                                        <span>{officeState ?? agentProductionTerms.notApplicableAbbrv},&nbsp;</span>
                                        : null}
                                    <span>{officeZipCode ?? agentProductionTerms.notApplicableAbbrv}</span>
                                </>
                                : agentProductionTerms.notApplicableAbbrv}
                        </span>
                        <span>
                            <Icon dataLwtId='phone-2-icon' className='mr-1' iconName='phone' />
                            {anchorElements.agentPhone2}
                        </span>
                    </div>
                    <div />
                </div>
            </div>
        </div>
    );
};

AgentContactInfo.propTypes = {
    agent: PropTypes.object.isRequired
};

export default AgentContactInfo;
