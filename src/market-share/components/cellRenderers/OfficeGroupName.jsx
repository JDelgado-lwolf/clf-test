import React from 'react';
import { Link } from 'react-router-dom';
import { Routes } from "../../../common/routes/routes";
import { uriEncode } from "../../helpers/helpers";
import PropTypes from 'prop-types';

export const OfficeGroupName = (props) => {
    const groupParam = uriEncode(props.data.groupName);
    const searchTypeRoute = props.data.isCoverageSearch ? Routes.MARKET_SHARE.COVERAGE : Routes.MARKET_SHARE.TOTALS;
    const pathname = `${Routes.MARKET_SHARE.BASE}${searchTypeRoute}${Routes.MARKET_SHARE.OFFICES_BREAKDOWN}`;
    const search = `?officeGroupName=${groupParam}&view=${props.data.supplementalData.listingViewId}`;
    return (
        <>
            {
                props.data?.isClickable
                    ? <Link
                        to={{
                            pathname,
                            search,
                            state: {
                                area: props.data?.areaId,
                                id: props.data.officeId,
                                group: groupParam,
                                listingViewId: props.data.supplementalData.listingViewId,
                                type: props.data.supplementalData.listingTypeId,
                                listingTypeId: props.data.supplementalData.listingTypeId,
                                rowCount: props.data.supplementalData.rowCount,
                                sumOfColumn: props.data.supplementalData.sumOfColumn,
                            }
                        }}>
                        {props.value}
                    </Link>
                    : <span>{props.value}</span>
            }
        </>
    );
};

OfficeGroupName.PropTypes = {
    data: PropTypes.object,
    value: PropTypes.string
};
