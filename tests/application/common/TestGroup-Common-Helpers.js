import BaseTestGroup from "../../BaseTestGroup";
import { TestDate }  from "./helpers/Test-date";
import { TestUtilities } from "./helpers/Test-utilities";
import { TestValidation } from './helpers/Test-validation';
import { TestEnvironment } from './helpers/Test-environment';
import { TestFeatureToggles } from './helpers/Test-featureToggles';
import { TestPendo } from './helpers/Test-pendo';
import { TestUserPrivileges } from './helpers/Test-userPrivileges';

export class TestGroupCommonHelpers extends BaseTestGroup {

    constructor() {
        super(
            [
                new TestDate(),
                new TestEnvironment(),
                new TestFeatureToggles(),
                new TestPendo(),
                new TestUserPrivileges(),
                new TestValidation(),
                new TestUtilities()
            ]
        );
    }
}
