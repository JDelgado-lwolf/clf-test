import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import AgentsTableControls from './AgentsTableControls';
import { contactToolTips, tabModes } from '../../constants/agentProductionConstants';
import Table from '../../../common/components/table/agGrid/Table';
import { tableViews } from '../../../common/components/table/agGrid/tableViews';

const ContactInformation = ({ agentData, columns, additionalTableHeaders, setColumns }) => {

    const gridRef = useRef();
    const [isTableSelected, setIsTableSelected] = useState(true);

    const agentsTableControlsProps = {
        tabMode: tabModes.CONTACT_INFORMATION,
        hasShowHideColumnsButton: true,
        columns,
        setColumns,
        isTableSelected,
        setIsTableSelected,
        popoverClassName: 'contact-information'
    };

    return (
        <>
            <AgentsTableControls {...agentsTableControlsProps} />
            <Table
                gridRef={gridRef}
                tableView={tableViews.contactInformation}
                rowData={agentData}
                columns={columns}
                additionalTableHeaders={additionalTableHeaders}
                tableTitleWithTooltips={contactToolTips}
            />
        </>
    );
};

ContactInformation.propTypes = {
    agentData: PropTypes.arrayOf(PropTypes.object),
    additionalTableHeaders: PropTypes.arrayOf(PropTypes.object),
    columns: PropTypes.arrayOf(PropTypes.object),
    setColumns: PropTypes.func
};

export default ContactInformation;
