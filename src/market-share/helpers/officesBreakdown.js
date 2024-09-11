import { getCompSetOfficeBreakdownList, getOfficeBreakdownList } from "../../service/service-gateway";

export const getAllOtherOfficesIds = async (selectedComparisonSetSearch) => {
    const allGroupOfficesIds = selectedComparisonSetSearch?.groups.flatMap(group => (
        group.offices.map(office => office.officeId)
    ));
    return allGroupOfficesIds;
};

export const getTotalsOfficeBreakdownList = async (brokerId, selectedComparisonSetSearch, officeGroupName, state) => {
    try {
        if (brokerId) return await getOfficeBreakdownList(brokerId, state.searchCriteria);

        const selectedOfficeGroup = selectedComparisonSetSearch?.groups.find(group => group.name === officeGroupName);
        let officesIds = [];
        if  (selectedOfficeGroup) {
            officesIds = selectedOfficeGroup?.offices.map(office => office.officeId);
        } else {
            officesIds = await getAllOtherOfficesIds(selectedComparisonSetSearch);
        }
        return await getCompSetOfficeBreakdownList(officesIds, state.searchCriteria, !selectedOfficeGroup);
    } catch (error) {
        console.error(error);
    }
};
