export default () => {
    const additionalHeaders = [
        {
            column1: {
                title: '',
                attrs: {
                    colSpan: 1,
                    className: 'border text-center col-wrap'
                }
            },
            column2: {
                title: 'Property',
                attrs: {
                    colSpan: 3,
                    className: 'border text-center '
                }
            },
            column3: {
                title: 'Price Change',
                attrs: {
                    colSpan: 2,
                    className: 'border text-center '
                }
            },
            column4: {
                title: 'CDOM Breakout',
                attrs: {
                    colSpan: 5,
                    className: 'border text-center '
                }
            }
        }
    ];

    return additionalHeaders;
}
