import { BaseTestSuite } from '../../../../BaseTestSuite';
import { getFilterGroups, getFiltersByGroupTitle, getRevisedGroups } from '../../../../../src/common/helpers/filter-list';

export class TestFilterList extends BaseTestSuite {
    arrange() {
        super.arrange();
        this.given = 'Given a module "common/components/search/filter-list.js"';

        this.filterGroups = [
            {
                title: 'Required',
                filters: [
                    { id: 'required filter1' },
                    { id: 'required filter2' },
                ]
            },
            {
                title: 'Optional',
                filters: [
                    { id: 'optional filter1' },
                    { id: 'comparisonSet' },
                ]
            },
        ];

        this.optionalFilters = ['optional filter1', 'comparisonSet']

        this.when = [
            ...this.when,
            {
                describe: 'When getRevisedGroups() is called',
                then: () => {
                    test('Then comparison sets are filtered out', () => {
                        expect(this.filterGroups[1].filters.length).toEqual(2);
                        const result = getRevisedGroups(this.filterGroups, 'comparisonSet');
                        expect(result[1].filters.length).toEqual(1);
                    });
                },
            },
        ];
        this.when = [
            ...this.when,
            {
                describe: 'When getFilterGroups() is called with comparison sets disabled',
                then: () => {
                    test('Then returned groups include what is expected', () => {
                        const groupsWithSetsDisabled = getFilterGroups({ isComparisonSetsEnabled: false });
                        expect(groupsWithSetsDisabled[1].filters.length).toEqual(8);
                    });
                },
            },
        ];
        this.when = [
            ...this.when,
            {
                describe: 'When getFilterGroups() is called with comparison sets enabled',
                then: () => {
                    test('Then returned groups include what is expected', () => {
                        const groupsWithSetsEnabled = getFilterGroups({ isComparisonSetsEnabled: true });
                        expect(groupsWithSetsEnabled[1].filters.length).toEqual(9);
                    });
                },
            },
        ];
        this.when = [
            ...this.when,
            {
                describe: 'When getFiltersByGroupTitle() is called',
                then: () => {
                    test('Then returned filters include what is expected', () => {
                    const optionalFilters = getFiltersByGroupTitle(this.filterGroups, 'Optional');
                    expect(optionalFilters).toEqual(this.optionalFilters);
                    });
                }
            }
        ]
    }
}
