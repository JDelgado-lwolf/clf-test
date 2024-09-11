export default () => {
    const underContractAdditionalHeaders = [
        {
            column1: {
                title: 'Currently Under Contract',
                attrs: {
                    colSpan: 4,
                    className: ' border text-center '
                }
            },
            column2: {
                title: 'Price',
                attrs: {
                    colSpan: 3,
                    className: ' border text-center '
                }
            },
            column3: {
                title: 'Dates',
                attrs: {
                    colSpan: 4,
                    className: ' border text-center '
                }
            },
            column4: {
                title: 'Property Attributes',
                attrs: {
                    colSpan: 8,
                    className: ' border text-center '
                }
            }
        }
    ];

    return underContractAdditionalHeaders;
}
