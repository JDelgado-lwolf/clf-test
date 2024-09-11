import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import { agentProductionTerms } from '../../../../../constants';
import { tableViews } from '../../../../../common/components/table/agGrid/tableViews';
import Table from '../../../../../common/components/table/agGrid/Table';
import { officeHistoryTooltips } from '../../../../constants/agentProductionConstants';

const OfficeHistoryTab = (props) => {
const { agent, isActive, sendToParent } = props;

    const getOfficeHistoryData = () => {
        const officeHistoryData = agent?.history.map(office => ({
            ...office,
            display: true
        }));
        officeHistoryData?.push({
            moveDate: new Date().toISOString(),
            officeId: agent.officeId,
            officeName: agent.officeName,
            display: false
        });
        return officeHistoryData;
    };
    
    useEffect(() => {
        if (!isActive) return
        sendToParent();
    }, [isActive]);

    return <>
        <div className="mt-4">
            {!getOfficeHistoryData().length && !agent.officeName.length
                ? <div className="no-Office-data">
                    {agentProductionTerms.officeHistoryNoData}
                </div>
                : <Table
                    tableView={tableViews.officeHistory}
                    rowData={getOfficeHistoryData()}
                    additionalTableHeaders={tableViews.officeHistory}
                    tableTitleWithTooltips={officeHistoryTooltips}
                />
            }
        </div>
    </>;
};

OfficeHistoryTab.propTypes = {
    agent: PropTypes.object
};
export default OfficeHistoryTab;
