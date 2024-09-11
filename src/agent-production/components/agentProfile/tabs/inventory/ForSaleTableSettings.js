export default () => {
    const forSaleAdditionalHeaders = [
        {
            column1: {
                title: 'Currently For Sale',
                attrs: {
                    colSpan: 4,
                    className: 'border text-center'
                }
            },
            column2: {
                title: 'Price',
                attrs: {
                    colSpan: 3,
                    className: 'border text-center'
                }
            },
            column3: {
                title: 'Dates',
                attrs: {
                    colSpan: 2,
                    className: 'border text-center'
                }
            },
            column4: {
                title: 'Property Attributes',
                attrs: {
                    colSpan: 7,
                    className: 'border text-center'
                }
            }
        }
    ];

    return forSaleAdditionalHeaders;
}
