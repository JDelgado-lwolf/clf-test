import * as _ from 'lodash-es';
import { agentFullName, modules, searchTerms } from '../../constants';
import { getKeyByValue } from './object';
import { formatMediumDate } from './date';
import { getTimePeriods } from './timePeriods';

export const defaultPropTypeTitle = searchTerms.selectType(searchTerms.propertyTypes);

export const getPropertyTypeTitle = (propTypes, selectedPropTypes) => {
    let title = defaultPropTypeTitle;
    const propTypesCount = _.sum(_.flatMap(propTypes, (x) => x.types.length));
    if (selectedPropTypes.length === 0) {
        title = defaultPropTypeTitle;
    } else if (selectedPropTypes.length === 1) {
        const found = _.find(
            _.flatten(_.map(propTypes, (propType) => propType.types)),
            (type) => type.typeId.toString() === selectedPropTypes[0]
        );
        if (found) title = found.longName;
    } else if (selectedPropTypes.length === propTypesCount) {
        title = 'All Property Types';
    } else {
        title = '';
        _.forEach(propTypes, (propType) => {
            const intersectionLength = _.intersection(_.map(propType.types, (type) => type.typeId.toString()), selectedPropTypes).length;
            if (propType.types.length === intersectionLength && selectedPropTypes.length === intersectionLength) {
                title = 'All ' + propType.longName;
            }
        });
        if (!title) {
            const found = _.find(_.flatten(_.map(propTypes, (propType) => propType.types)), (x) => x.typeId.toString() === selectedPropTypes[0]);
            if (found) {
                title = `${found.longName} +${selectedPropTypes.length - 1}`;
            }
        }
    }
    return { mainTitle: title };
};

export const getTimeFrameTitle = (selectedTimeFrame, timeIntervals, module) => {
    const selectedTimeInterval = timeIntervals?.find(ti => ti.intervalType === selectedTimeFrame.intervalType);

    const dateRange = selectedTimeInterval &&
        formatMediumDate(new Date(`${selectedTimeInterval.last.from}Z`)) +
        ' - ' +
        formatMediumDate(new Date(`${selectedTimeInterval.last.to}Z`));

    const timePeriods = getTimePeriods(module);

    return {
        mainTitle: getKeyByValue(timePeriods, selectedTimeFrame.intervalType),
        subtitle: dateRange ?? (selectedTimeFrame.startDate && selectedTimeFrame.endDate
            ? `${formatMediumDate(new Date(`${selectedTimeFrame.startDate}T00:00:00Z`))} - ${formatMediumDate(new Date(`${selectedTimeFrame.endDate}T23:59:59Z`))}`
            : undefined)
    };
};

export const getMarketAreaMainTitle = ({ module, isEmpty = true }) => {
    const isMarketDynamics = module === modules.marketDynamics.marketDynamics;
    const mainTitle = isMarketDynamics
        ? searchTerms.areaType
        : searchTerms.marketArea;
    return isEmpty
        ? searchTerms.selectType(mainTitle)
        : mainTitle;
};

export const getMarketAreaTitle = ({ selectedAreas, searchAllMls, module }) => {
    if (searchAllMls) {
        return { mainTitle: searchTerms.marketArea, subTitle: searchTerms.lowerAllMls };
    }
    const valuesCount = selectedAreas[0]?.fieldValues?.length;
    return {
        mainTitle: valuesCount
            ? searchTerms.transactionsIn
            : getMarketAreaMainTitle({
                module
            }),
        subTitle: valuesCount
            ? `${selectedAreas[0].fieldValueDescriptions
            && selectedAreas[0].fieldValueDescriptions[0] !== 'undefined'
            && selectedAreas[0].fieldValueDescriptions[0] !== selectedAreas[0].fieldValues[0]
                ? `${_.startCase(selectedAreas[0].fieldValues[0])} (${_.startCase(selectedAreas[0].fieldValueDescriptions[0])})`
                : `${_.startCase(selectedAreas[0].fieldValues[0])}`} ${valuesCount > 1 ? ` +${valuesCount - 1}` : ''}`
            : undefined
    };
};

export const getMarketAreaListTitle = (name, area) => {
    return {
        mainTitle: `${name} (${area})`
    };
};

const getRangeSubtitle = (values, isCurrency) => {
    return values.min || values.max
        ? values.min === values.max
            ? `${isCurrency ? '$' : ''}${values.min.toLocaleString()}`
            : `${!values.min
            ? values.max && 'up to '
            : `${isCurrency ? '$' : ''}${values.min.toLocaleString()}`}` +
            `${values.max
                ? values.min
                    ? ` - ${isCurrency ? '$' : ''}${values.max.toLocaleString()}`
                    : `${isCurrency ? '$' : ''}${values.max.toLocaleString()}`
                : '+'
            }`
        : undefined;
};
export const getOfficeListTitle = officeListName => {
    return {
        mainTitle: officeListName
    };
};


export const getOfficesTitle = (selectedOffices, offices) => {
    const officesCount = selectedOffices?.length;
    return {
        mainTitle: officesCount
            ? `${offices.find(o => o.officeId === selectedOffices[0])?.officeName}${officesCount > 1 ? ` +${officesCount - 1}` : ''}`
            : searchTerms.selectType(searchTerms.offices)
    };
};

export const getAgentsTitle = selectedAgents => {
    const agentsCount = selectedAgents?.length;
    return {
        mainTitle: agentsCount
            ? `${agentFullName(selectedAgents[0])}${agentsCount > 1 ? ` +${agentsCount - 1}` : ''}`
            : searchTerms.selectType(searchTerms.agents)
    };
};

export const getAgentListTitle = agentListName => {
    return {
        mainTitle: agentListName
    };
};

export const getRangeTitle = (searchTerm, values, isCurrency) => {
    const range = getRangeSubtitle(values, isCurrency);
    return {
        mainTitle: range ? searchTerm : searchTerms.selectType(searchTerm),
        subTitle: range && range.toLowerCase()
    };
};

export const getLotSizeTitle = (searchTerm, values) => {
    const range = getRangeSubtitle(values, false);
    return {
        mainTitle: range ? searchTerm : searchTerms.selectType(searchTerm),
        subTitle: range && range.toLowerCase()
    };
};

export const currencyFields = ['totalVolume', 'soldPrice'];
