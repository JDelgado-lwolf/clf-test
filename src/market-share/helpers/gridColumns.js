import { CustomPinnedRow } from "../../common/components/table/CustomPinnedRow";

export const getCustomPinnedRow = (params) => {
    if (params.node.rowPinned) {
        return {
            component: CustomPinnedRow
        };
    }
    return undefined;
};
