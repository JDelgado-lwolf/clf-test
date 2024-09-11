export const translateListingViewGroups = ({ listingViewGroups, handleListingViewItemClick, selectedListingViewId }) => {

    const listingViewOptions = [];
    let statusOptions, defaultListingViewId;

    listingViewGroups?.map(listingViewGroup => {

        if (listingViewGroup.group) {
            listingViewOptions.push({
                dataLwtId: listingViewGroup.group,
                itemText: listingViewGroup.group.toUpperCase(),
                disabled: true,
                key: listingViewGroup.group
            });
        }

        listingViewGroup?.options.map(listingViewOption => {

            if (!defaultListingViewId &&
                listingViewOption.isDefault) defaultListingViewId = listingViewOption.value;

            const isChecked = selectedListingViewId === listingViewOption.value ||
                !selectedListingViewId && listingViewOption.isDefault;

            if (isChecked && listingViewOption.statusOptions) {
                statusOptions = listingViewOption.statusOptions;
            }
            listingViewOptions.push({
                dataLwtId: listingViewOption.value,
                itemText: listingViewOption.label,
                checked: isChecked,
                key: listingViewOption.value,
                tooltip: listingViewOption?.tooltip,
                onClick: () => handleListingViewItemClick(listingViewOption.value)
            });
        });
    });

    return {
        listingViewOptions,
        defaultListingViewId,
        statusOptions
    };
};
