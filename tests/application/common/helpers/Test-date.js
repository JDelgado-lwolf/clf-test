import { BaseTestSuite }   from "../../../BaseTestSuite";
import { formatShortDate } from "../../../../src/common/helpers/date";


export class TestDate extends BaseTestSuite {

    arrange() {

        super.arrange();

        this.given = 'Given a module "common/helpers/date.js"';

        this.when = [
            ...this.when,
            {
                describe: 'When function "formatShortDate" was called',
                then    : () => {
                    test( 'Then it returns "01/01/2023" on parameter value equal to "new Date( 2023, 0, 1 )"',
                          () => {
                              const value       = new Date( 2023, 0, 1 );
                              const expectation = "01/01/2023";

                              this.#checkValue( value, expectation );
                          }
                    );

                    test( 'Then it returns "01/01/2023" on parameter value equal to "new Date( 2023, 0, 1, 2, 3, 4 )"',
                          () => {
                              const value       = new Date( 2023, 0, 1, 2, 3, 4 );
                              const expectation = "01/01/2023";

                              this.#checkValue( value, expectation );
                          }
                    );

                    test( 'Then it returns "12/31/2022" on parameter value equal to "new Date( 2022, 11, 31, 2, 3, 4 )"',
                          () => {
                              const value       = new Date( 2022, 11, 31, 2, 3, 4 );
                              const expectation = "12/31/2022";

                              this.#checkValue( value, expectation );
                          }
                    );

                    test( 'Then it returns "01/01/1000" on parameter value equal to "new Date( 1000, 0, 1, 2, 3, 4 )"',
                          () => {
                              const value       = new Date( 1000, 0, 1, 2, 3, 4 );
                              const expectation = "01/01/1000";

                              this.#checkValue( value, expectation );
                          }
                    );

                    test( 'Then it returns "12/31/1000" on parameter value equal to "new Date( 1000, 11, 31, 2, 3, 4 )"',
                          () => {
                              const value       = new Date( 1000, 11, 31, 2, 3, 4 );
                              const expectation = "12/31/1000";

                              this.#checkValue( value, expectation );
                          }
                    );

                    test( 'Then it returns "01/01/3000" on parameter value equal to "new Date( 3000, 0, 1, 2, 3, 4 )"',
                          () => {
                              const value       = new Date( 1000, 0, 1, 2, 3, 4 );
                              const expectation = "01/01/1000";

                              this.#checkValue( value, expectation );
                          }
                    );

                    test( 'Then it returns "12/31/3000" on parameter value equal to "new Date( 3000, 11, 31, 2, 3, 4 )"',
                          () => {
                              const value       = new Date( 1000, 11, 31, 2, 3, 4 );
                              const expectation = "12/31/1000";

                              this.#checkValue( value, expectation );
                          }
                    );

                    test( 'Then it throws an error on parameter value equal to "null"',
                          () => {
                              const value       = null;
                              const expectation = null;

                              this.#checkValue( value, expectation );
                          }
                    );

                    test( 'Then it throws an error on parameter value equal to "undefined"',
                          () => {
                              const value       = undefined;
                              const expectation = null;

                              this.#checkValue( value, expectation );
                          }
                    );

                    test( 'Then it throws an error on parameter value equal to "empty string"',
                          () => {
                              const value       = "";
                              const expectation = null;

                              this.#checkValue( value, expectation );
                          }
                    );

                    test( 'Then it throws an error on parameter value equal to "empty array"',
                          () => {
                              const value       = [];
                              const expectation = null;

                              this.#checkValue( value, expectation );
                          }
                    );

                    test( 'Then it throws an error on parameter value equal to "empty object"',
                          () => {
                              const value       = {};
                              const expectation = null;

                              this.#checkValue( value, expectation );
                          }
                    );
                }
            }
        ];
    }


    #checkValue( value, expectation ) {

        let resultValue;
        let errorThrown = false;

        try {

            resultValue = formatShortDate( value );

        } catch( e ) {

            errorThrown = true;
        }

        if( expectation === null ) {

            expect( errorThrown ).toBeTruthy();

        } else {

            expect( errorThrown ).toBeFalsy();
            expect( resultValue ).toEqual( expectation );
        }
    }


};
