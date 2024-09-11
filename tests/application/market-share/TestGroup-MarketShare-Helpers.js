import BaseTestGroup                from "../../BaseTestGroup";
import { TestListingTypesHelper }   from "./constants/Test-listingTypes";
import { TestComparisonSets } from "./helpers/Test-comparisonSets";
import { TestHelpers } from "./helpers/Test-helpers";

export class TestGroupMarketShareHelpers extends BaseTestGroup {

    constructor() {

        super(
            [
                new TestListingTypesHelper(),
                new TestComparisonSets(),
                new TestHelpers(),
            ]
        );
    }


};
