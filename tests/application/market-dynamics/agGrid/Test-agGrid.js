import { agentProductionTerms as apt } from '../../../../src/constants';
import { getDataByDisplayedColumns, getDefaultSortColumnSettings, getRevisedOfficeBreakdownColumns } from '../../../../src/market-dynamics/helpers/agGrid';
import { BaseTestSuite } from '../../../BaseTestSuite';
import { columns, garages, revisedBreakdownColumns, tableView } from '../data/officeBreakdown';
import { medianPrice } from '../../../../src/market-dynamics/constants/listingViews/medianPrice';

export class TestAgGridHelpers extends BaseTestSuite {
    arrange() {
        super.arrange();
        this.tableView = { medianPrice: medianPrice.tableSettings.id};
        this.given = 'Given a module "market-dynamics/agGrid/agGrid.js"';

        this.when = [
            ...this.when,
            {
                describe: 'When function "getDefaultSortColumnSettings" was called',
                then: () => {
                    test('Then it will return the first object with units as measureType found', () => {
                        const result = getDefaultSortColumnSettings(columns);
                        expect(result).toEqual({ colId: columns[1].col.id, sortDir: 'desc', isBreakdown: true });
                    });
                },
            },
            {
                describe: 'When function "getRevisedOfficeBreakdownColumns" was called',
                then: () => {
                    test('Then it will return a revised office breakdown column settings', () => {
                        const result = getRevisedOfficeBreakdownColumns(tableView);
                        expect(JSON.stringify(result)).toEqual(JSON.stringify(revisedBreakdownColumns));
                    });
                    test('Then the label of first column should be Office', () => {
                        const result = getRevisedOfficeBreakdownColumns(tableView);
                        expect(result[0].col.label).toEqual(apt.office);
                    });
                },
            },
            {
                describe: 'When function "getDataByDisplayedColumns" was called',
                then: () => {
                    test('Then it will return displayed columns data', () => {
                        const displayedColumns = [
                            {col: {id: "garageName"}},
                            {col: {id: "boat"}},
                        ];
                        const result = getDataByDisplayedColumns(garages, displayedColumns);
                        expect(result).toEqual([
                            {garageName: "Garage 1", boat: 1},
                            {garageName: "Garage 3", boat: 8}
                        ]);
                    });
                },
            },
        ];
    }
};
