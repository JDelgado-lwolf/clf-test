import React from 'react';
import { Link } from 'react-router-dom';
import { Routes } from "../../../common/routes/routes";
import { uriEncode } from "../../helpers/helpers";
import PropTypes from 'prop-types';


export const OfficeName = (props) => {
    const officeParam = uriEncode(props.data.officeName);
    const searchTypeRoute = props.data.isCoverageSearch ? Routes.MARKET_SHARE.COVERAGE : Routes.MARKET_SHARE.TOTALS;

    return (
        <Link
            to={{
                pathname: `${Routes.MARKET_SHARE.BASE}${searchTypeRoute}${Routes.MARKET_SHARE.OFFICE_LISTING}`,
                search: `?office=${officeParam}&id=${props.data.officeId}`,
                state: {
                    area: props.data?.areaId,
                    id: props.data.officeId,
                    office: officeParam,
                    listingTypeId: props.data.listingTypeId,
                    view: props.data.listingViewId
                }
            }}>
            {props.value}
        </Link>
    );
};

OfficeName.PropTypes = {
    data: PropTypes.object,
    value: PropTypes.string
};
