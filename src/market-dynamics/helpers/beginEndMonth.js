import { longQuarterNumberAndYear } from "../../agent-production/helpers/dataFormatters";
import { terms } from "../constants";

export const getBeginOrEndOptions = (optionType, agentData, formatter, setSelectedValue, selectedComplementValue) =>
    agentData?.map((period, index) => {
        return {
            dataLwtId: `${optionType === terms.begin ? 'begin-option' : 'end-option'}${index}`,
            value: period.timePeriodStart,
            itemText: formatter(period.timePeriodStart, longQuarterNumberAndYear),
            key: `item_${index}`,
            onClick: () => setSelectedValue(period.timePeriodStart)
        };
    }).reverse().filter((option) => {
        if (optionType === terms.begin) return new Date(selectedComplementValue) > new Date(option.value);
        return new Date(selectedComplementValue) < new Date(option.value);
    });
