import { csvFileNameFormatter } from '../../../../src/agent-production/helpers/agentProductionHelpers';
import { BaseTestSuite }        from "../../../BaseTestSuite";

export class TestAgentProductionHelpers extends BaseTestSuite {

    arrange() {
        super.arrange();

        this.given = 'Given a module "agent-production/helpers/agentProductionHelpers.js"';

        this.when = [
            ...this.when,
            {
                describe: 'When function "csvFileNameFormatter" was called',
                then    : () => {
                    test( 'Then "csvFileNameFormatter" responds properly on overview tab mode',
                          () => {
                              const fileNameOverview = csvFileNameFormatter( 'overview' );
                              expect( fileNameOverview ).toBeDefined();
                              expect( fileNameOverview ).toContain( 'Agent Production Overview Export -' );
                          }
                    );

                    test( 'Then "csvFileNameFormatter" responds properly on growthAnalysis tab mode',
                          () => {
                              const fileNameGrowthAnalysis = csvFileNameFormatter( 'growthAnalysis' );
                              expect( fileNameGrowthAnalysis ).toBeDefined();
                              expect( fileNameGrowthAnalysis ).toContain( 'Agent Production Growth Analysis Export -' );
                          }
                    );
                    test( 'Then "csvFileNameFormatter" responds properly on contactInformation tab mode',
                          () => {
                              const fileNameContactInformation = csvFileNameFormatter( 'contactInformation' );
                              expect( fileNameContactInformation ).toBeDefined();
                              expect( fileNameContactInformation ).toContain( 'Agent Production Contact Information Export -' );
                          }
                    );
                    test( 'Then "csvFileNameFormatter" responds properly on listingProficiency tab mode',
                          () => {
                              const fileNameListingProficiency = csvFileNameFormatter( 'listingProficiency' );
                              expect( fileNameListingProficiency ).toBeDefined();
                              expect( fileNameListingProficiency ).toContain( 'Agent Production Listing Proficiency Export -' );
                          }
                    );
                    test( 'Then "csvFileNameFormatter" responds properly on unassigned tab mode',
                          () => {
                              const fileNameUnassigned = csvFileNameFormatter( 'unassigned' );
                              expect( fileNameUnassigned ).toBeUndefined();
                          }
                    );
                }
            }
        ];
    }
};
