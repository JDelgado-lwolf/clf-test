import BaseTestGroup                     from "../../BaseTestGroup";
import { TestAgentProductionHelpers }    from "./helpers/Test-agentProductionHelpers";
import { TestListingProficiencyHelpers } from "./helpers/Test-listingProficiencyHelpers";
import { TestDataFormatters }            from "./helpers/Test-dataFormatters";

export class TestGroupAgentProductionHelpers extends BaseTestGroup {

    constructor() {

        super(
            [
                new TestAgentProductionHelpers(),
                new TestDataFormatters(),
                new TestListingProficiencyHelpers(),
            ]
        );
    }


};
