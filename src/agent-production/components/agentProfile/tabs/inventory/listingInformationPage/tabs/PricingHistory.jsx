import React from 'react';
import PropTypes from 'prop-types';
import getPricingHistoryTableSettings from './PricingHistoryTableSettings';
import Table from '../../../../../../../common/components/table/agGrid/Table';
import { tableViews } from '../../../../../../../common/components/table/agGrid/tableViews';

const PricingHistory = ({ data }) => {
    const { pricingHistoryColDefs, pricingHistoryTooltips } = getPricingHistoryTableSettings();

    return (
        <>
            {data?.length && (
                <Table
                    tableView={tableViews.pricingHistory}
                    rowData={data}
                    columns={pricingHistoryColDefs}
                    tableTitleWithTooltips={pricingHistoryTooltips}
                />
            )}
        </>
    );
};

PricingHistory.propTypes = {
    data: PropTypes.array.isRequired
};

export default PricingHistory;
