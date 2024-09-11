export const getStatusOptions = (listingViewGroups, listingViewId) => {
    for (let i = 0; i < listingViewGroups?.length; i++) {
        const lvg = listingViewGroups[i];
        const foundListingView =  lvg.options?.find(listingView => listingView.value === listingViewId);
        if (foundListingView) {
            return foundListingView.statusOptions;
        }
    }
    return null;
};

export const setDefaultOptionsToChecked = (statusOptions, shouldHideCdomOption) => {
    let optionsToReturn = [];

    statusOptions?.groups?.map(group => {
        group?.options?.map(option => {
            if(shouldHideCdomOption(option)) return
            optionsToReturn.push({
                ...option,
                checked: option.isDefault
            });
        });
    });
    return optionsToReturn;
};
