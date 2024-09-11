import BaseTestGroup from '../../../BaseTestGroup';
import { TestFilterList } from './search/Test-Filter-List';

export class TestGroupCommonComponents extends BaseTestGroup {

    constructor() {
        super(
            [
                new TestFilterList(),
            ]
        );
    }
}
