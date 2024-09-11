import { getHeaderText } from "../../../../src/agent-production/helpers/listingProficiencyHelpers";
import { BaseTestSuite } from "../../../BaseTestSuite";

export class TestListingProficiencyHelpers extends BaseTestSuite {

    arrange() {
        super.arrange();

        this.given = 'Given a module "agent-production/helpers/listingProficiencyHelpers.js"';

        this.when = [
            ...this.when,
            {
                describe: 'When function "getCurrentLast12MonthsText" was called',
                then    : () => {
                    test( 'Then "getCurrentLast12MonthsText" responds properly',
                          async() => {
                              jest.useFakeTimers();
                              jest.setSystemTime( new Date( '30 Oct 2023 00:00:00 GMT' ).getTime() );
                              const range = getHeaderText();
                              expect( range ).toBeDefined();
                              expect( range ).toContain( 'Oct 01, 2022 - Sep 30, 2023' );
                          }
                    );
                }
            }
        ];
    }
};
