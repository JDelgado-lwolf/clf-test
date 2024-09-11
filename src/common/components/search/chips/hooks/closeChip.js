import { useEffect } from "react"
import { useSearchStore } from "../../../../../store/store";
import { setStateData } from "../../../../helpers/state";
import { toggleRunSearchButton } from "../../../../helpers/search";

export const useCloseChip = (isPopoverOpen, setState, isListModalOpen) => {
    const { shouldCloseChips, setShouldCloseChips } = useSearchStore(state => ({
        shouldCloseChips: state.shouldCloseChips,
        setShouldCloseChips: state.setShouldCloseChips
    }));

    useEffect(() => {
        if (shouldCloseChips && isPopoverOpen) {
            setStateData('isPopoverOpen', false, setState);
            isListModalOpen && setStateData('isListModalOpen', false, setState);
            setShouldCloseChips(false);
        }
    }, [shouldCloseChips]);

    // TODO: Remove this useEffect from every Chip component and leave this one
    useEffect(() => {
        toggleRunSearchButton(isPopoverOpen);
    }, [isPopoverOpen]);
};
