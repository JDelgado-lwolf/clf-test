import React from 'react';
import AgentsExport from '../AgentsExport';
import { agentProductionTerms as agProdTerms } from '../../../constants';
import { views } from '../../constants/savedAgents';
import { setStateData } from '../../../common/helpers/state';
import { getHeaderText as getListingProfExportHeaderText } from '../../helpers/listingProficiencyHelpers';
import { tabIndexes } from '../../helpers/agentProductionHelpers';
import { tabModes } from '../../constants/agentProductionConstants';

export const exportCsv = (state, setState, selectedView, selectedAgents) => {

    const handleClose = () => {
        setStateData('showModal', false, setState);
    };

    const commonModalProps = ({
        size: 'lg',
        title: agProdTerms.exportData,
        showFooter: false,
        onClose: handleClose,
        show: true,
        footerClassName: '',
        dataLwtId: 'agent-production-modal',
    });

    let columnsByPeriod;

    if (state.growthAnalysisPeriod === agProdTerms.last12Months) {
        columnsByPeriod = state.growthAnalysisColumnsLtm;
    } else {
        columnsByPeriod = state.growthAnalysisColumnsYtd;
    }

    const buildAgentsExport = ({ defaultColumns, tabMode, ...restProps }) => (
        <AgentsExport
            handleClose={handleClose}
            selectedAgents={selectedAgents}
            defaultColumns={defaultColumns}
            tabMode={tabMode}
            currentSearchDates={state.currentSearchDates}
            {...restProps}
        />
    );

    const tabViews = {
        [tabIndexes.OVERVIEW]: {
            ...commonModalProps,
            children: buildAgentsExport({
                defaultColumns: state.overviewColumns,
                tabMode: tabModes.OVERVIEW,
            }),
        },
        [tabIndexes.CONTACT_INFORMATION]: {
            ...commonModalProps,
            children: buildAgentsExport({
                defaultColumns: state.contactInfoColumns,
                tabMode: tabModes.CONTACT_INFORMATION,
            }),
        },
        [tabIndexes.GROWTH_ANALYSIS]: {
            ...commonModalProps,
            children: buildAgentsExport({
                defaultColumns: columnsByPeriod,
                tabMode: tabModes.GROWTH_ANALYSIS,
                growthAnalysisPeriod: state.growthAnalysisPeriod,
                timeIntervals: state.timeIntervals,
            }),
        },
        [tabIndexes.LISTING_PROFICIENCY]: {
            ...commonModalProps,
            title: getListingProfExportHeaderText(),
            children: buildAgentsExport({
                defaultColumns: state.listingProficiencyColumns,
                tabMode: tabModes.LISTING_PROFICIENCY,
            }),
        },
    };

    const modalPropsSettingsByView = ({
        ...tabViews,
        [views.overview]: {
            ...commonModalProps,
            children: buildAgentsExport({
                defaultColumns: state.overviewColumns,
                tabMode: views.overview,
            }),
        },
        [views.contactInformation]: {
            ...commonModalProps,
            children: buildAgentsExport({
                defaultColumns: state.contactInfoColumns,
                tabMode: views.contactInformation,
            }),
        },
        [views.growthAnalysis]: {
            ...commonModalProps,
            children: buildAgentsExport({
                defaultColumns: state.growthAnalysisColumns,
                tabMode: views.growthAnalysis,
                growthAnalysisPeriod: state.growthAnalysisPeriod,
                timeIntervals: state.timeIntervals,
            }),
        },
        [views.listingProficiency]: {
            ...commonModalProps,
            title: getListingProfExportHeaderText(),
            children: buildAgentsExport({
                defaultColumns: state.listingProfColumns,
                tabMode: views.listingProficiency,
            }),
        },
    });

    const modalProps = modalPropsSettingsByView[selectedView];

    const showModal = !!modalProps;
    setState(prevState => ({ ...prevState, modalProps, showModal }));
};
