import BaseTestGroup from "../../BaseTestGroup";
import { TestAgGridHelpers } from "./agGrid/Test-agGrid";

export class TestGroupMarketDynamicsHelpers extends BaseTestGroup {

    constructor() {

        super(
            [
                new TestAgGridHelpers(),
            ]
        );
    }


};
