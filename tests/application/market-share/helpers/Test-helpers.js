import { BaseTestSuite } from '../../../BaseTestSuite';
import { getSortedObjectByProp } from '../../../../src/market-share/helpers/helpers';

export class TestHelpers extends BaseTestSuite {
    arrange() {
        super.arrange();
        this.given =  'Given a module "market-share/helpers/helpers.jsx"';

        this.objectArray = [
            { name: 'John' },
            { name: 'Doe' },
            { name: 'Ralph' },
        ];

        this.objectArraySortedAscByName = [
            { name: 'Doe' },
            { name: 'John' },
            { name: 'Ralph' },
        ];

        this.objectArraySortedDescByName = [
            { name: 'Ralph' },
            { name: 'John' },
            { name: 'Doe' },
        ];

        this.when = [
            ...this.when,
            {
                describe: 'When function "getSortedObjectByProp" with ASC order was called',
                then: () => {
                    test('Then it returns sorted object Array correctly', () => {
                      const result = getSortedObjectByProp(this.objectArray, 'name');
                      expect(result).toEqual(this.objectArraySortedAscByName);
                  });
                },
            },
            {
                describe: 'When function "getSortedObjectByProp" with DESC order was called',
                then: () => {
                    test('Then it returns sorted object Array correctly', () => {
                      const result = getSortedObjectByProp(this.objectArray, 'name', 'DESC');
                      expect(result).toEqual(this.objectArraySortedDescByName);
                  });
                },
            },
        ];
    }
};
