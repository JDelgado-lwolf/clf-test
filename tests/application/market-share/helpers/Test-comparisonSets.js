import { BaseTestSuite } from '../../../BaseTestSuite';
import { getCompSetsByMLsWithOfficeGroup, getComparisonSetParams, getMlsToSet, buildInitialAvailableOffices } from '../../../../src/market-share/helpers/comparisonSets';
import { expectedParams, searchCriteria, selectedCompSet } from '../data/comparisonSets';
import { mlsList, expectedMlsToSet } from '../data/mls';
import { comparisonSetsToCheckGroupOffices } from '../data/comparisonSetsHideEmpty';

export class TestComparisonSets extends BaseTestSuite {
    arrange() {
        super.arrange();
        this.given =  'Given a module "market-share/helpers/comparisonSets.js"';
        this.selectedComparisonSet = {
            groups: [
                {
                    offices: [
                        { officeId: 1 },
                        { officeId: 2 }
                    ]
                },
                {
                    offices: [
                        { officeId: 3 }
                    ]
                }
            ]
        };

        this.selectedComparisonSetOfficesList = [
            { officeId: 1 },
            { officeId: 2 },
            { officeId: 3 },
            { officeId: 4 },
            { officeId: 5 }
        ];

        this.when = [
            ...this.when,
            {
                describe: 'When function "getComparisonSetParams" was called',
                then: () => {
                    test('Then it return params correctly', () => {
                      const result = getComparisonSetParams(searchCriteria, selectedCompSet);
                      expect(result).toEqual(expectedParams);
                  });
                },
            },
            {
                describe: 'When function "getCompSetsByMLsWithOfficeGroup" was called',
                then: () => {
                    test('Then it returns all the comparison sets that have group offices', () => {
                      const result = getCompSetsByMLsWithOfficeGroup(comparisonSetsToCheckGroupOffices);
                      expect(result.length).toEqual(3);
                  });
                },
                then: () => {
                    test('Then it returns an empty array when no comparison set has group offices', () => {
                        const result = getCompSetsByMLsWithOfficeGroup(comparisonSetsToCheckGroupOffices);
                      expect(result).toEqual([]);
                  });
                },
            },
            {
                describe: 'When function "buildInitialAvailableOffices" was called',
                then: () => {
                    test('Then it returns the correct list of available offices', () => {
                        const result = buildInitialAvailableOffices(this.selectedComparisonSet, this.selectedComparisonSetOfficesList);
                        expect(result).toEqual([
                            { officeId: 4 },
                            { officeId: 5 }
                        ]);
                    });
                },
            },
            {
                describe: 'When function "getMlsToSet" was called',
                then: () => {
                    test('Then it return mlsToSet correctly', () => {
                        const result = getMlsToSet(mlsList, selectedCompSet);
                        expect(result).toEqual(expectedMlsToSet);
                    });
                },
            },
        ];
    }
}
