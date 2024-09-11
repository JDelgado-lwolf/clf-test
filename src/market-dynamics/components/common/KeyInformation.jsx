import React, { useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AGGridHelix } from '@lwt-helix/ag-grid';
import { findDataByDate, getCalculatedRows, getColumnDefs } from '../../helpers/keyInformation';
import ColumnHeader from '../../../common/components/table/agGrid/ColumnHeader';
import { useFeatureToggles } from '../../../common/hooks/featureToggles';

const KeyInformation = (props) => {
    const { searchCriteria, searchResults, statusOptions, listingConfig, selectedPeriodComparison,
        beginPeriodDate, endPeriodDate } = props;

    const [state, setState] = useState({
        beginPeriodData: undefined,
        columnDefs: [],
        endPeriodData: undefined,
        lastWeeksData: undefined,
        previousWeeksData: undefined,
        rowData: []
    });
    const gridRef = useRef();
    const featureToggles = useFeatureToggles();

    const timeInterval = searchCriteria?.timePeriod.intervalType;

    useEffect(() => {
        if (searchResults) {
            const endPeriodData = findDataByDate(searchResults, endPeriodDate);
            const beginPeriodData = findDataByDate(searchResults, beginPeriodDate);
            const lastWeeksData = searchResults?.slice(0, searchResults.length / 2);
            const previousWeeksData = searchResults?.slice(searchResults.length / 2);

            setState((prevState) => ({
                ...prevState,
                endPeriodData,
                beginPeriodData,
                previousWeeksData,
                lastWeeksData
            }));
        }
    }, [searchResults]);

    useEffect(() => {
        const defineColumnsProps = {
            listingConfig,
            timeInterval,
            beginPeriodDate,
            endPeriodDate,
            selectedPeriodComparison
        };

        const columnDefs = getColumnDefs(defineColumnsProps);

        setState((prevState) => ({
            ...prevState,
            columnDefs
        }));
        gridRef.current?.api?.setColumnDefs(columnDefs);
    }, [listingConfig, selectedPeriodComparison]);

    useEffect(() => {
        let rowData;
        if (searchResults) {
            const calculateRowProps = {
                timeInterval,
                endPeriodData: state.endPeriodData,
                beginPeriodData: state.beginPeriodData,
                previousWeeksData: state.previousWeeksData,
                lastWeeksData: state.lastWeeksData,
                listingConfig,
                statusOptions,
                featureToggles,
                searchResults,
                selectedPeriodComparison
            };

            rowData = getCalculatedRows(calculateRowProps);
        }

        setState((prevState) => ({
            ...prevState,
            rowData
        }));
    }, [searchResults, state.endPeriodData, state.beginPeriodData, state.previousWeeksData, 
        state.lastWeeksData, listingConfig, featureToggles.trendAnalysisDebugOutput.isEnabled]);

    const agGridComponents = useMemo(() => {
        return {
            agColumnHeader: ColumnHeader
        };
    }, []);

    return (
        <>
            {state.rowData && (
                <AGGridHelix
                    ref={gridRef}
                    rowData={state.rowData}
                    columnDefs={state.columnDefs}
                    suppressMultiSort
                    domLayout="autoHeight"
                    suppressClickEdit={true}
                    components={agGridComponents}
                />
            )}
        </>
    );
};

KeyInformation.PropTypes = {
    searchCriteria: PropTypes.object,
    searchResults: PropTypes.arrayOf(PropTypes.object),
    statusOptions: PropTypes.arrayOf(PropTypes.object),
    listingConfig: PropTypes.object,
    beginPeriodDate: PropTypes.string,
    endPeriodDate: PropTypes.string
};

export default KeyInformation;
