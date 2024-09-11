import { BaseTestSuite }                                    from "../../../BaseTestSuite";
import { getBlankZeroFormatter, getCurrencyFormat, getIntegerFormat, hasNoLength, yearMonthDayDashDateFormat } from "../../../../src/agent-production/helpers/dataFormatters";


export class TestDataFormatters extends BaseTestSuite {

    arrange() {

        super.arrange();

        this.given = 'Given a module "agent-production/helpers/dataFormatters.js"';

        this.when = [
            ...this.when,
            {
                describe: 'When function "getCurrencyFormat" was called',
                then    : () => {
                    test( 'Then "getCurrencyFormat" responds properly',
                          async() => {
                              const currency = getCurrencyFormat( 100000 );
                              expect( currency ).toBeDefined();
                              expect( currency ).toEqual( '$100,000' );
                          }
                    );
                }
            },
            {
                describe: 'When function "hasNoLength" was called',
                then    : () => {

                    test( 'Then it returns "true" on parameter value equal to "empty string"',
                          () => {
                              this.#checkValue_hasNoLength( "", true );
                          }
                    );

                    test( 'Then it returns "true" on parameter value equal to "undefined"',
                          () => {
                              this.#checkValue_hasNoLength( undefined, true );
                          }
                    );

                    test( 'Then it returns "true" on parameter value equal to "null"',
                          () => {
                              this.#checkValue_hasNoLength( null, true );
                          }
                    );

                    test( 'Then it returns "true" on parameter value equal to "empty array"',
                          () => {
                              this.#checkValue_hasNoLength( [], true );
                          }
                    );

                    test( 'Then it returns "false" on parameter value equal to "string \'abc\'"',
                          () => {
                              this.#checkValue_hasNoLength( "abc", false );
                          }
                    );

                    test( 'Then it returns "false" on parameter value equal to "integer 0"',
                          () => {
                              this.#checkValue_hasNoLength( 0, false );
                          }
                    );

                    test( 'Then it returns "false" on parameter value equal to "boolean false"',
                          () => {
                              this.#checkValue_hasNoLength( false, false );
                          }
                    );

                    test( 'Then it returns "false" on parameter value equal to "boolean true"',
                          () => {
                              this.#checkValue_hasNoLength( true, false );
                          }
                    );

                    test( 'Then it returns "false" on parameter value equal to "empty object"',
                          () => {
                              this.#checkValue_hasNoLength( {}, false );
                          }
                    );
                }
            },
            {
                describe: 'When function "getIntegerFormat" was called',
                then    : () => {

                    test( 'Then it returns "0" on parameter value equal to "integer 0"',
                          () => {
                              this.#checkValue_getIntegerFormat( 0, "0" );
                          }
                    );

                    test( 'Then it returns "12,345" on parameter value equal to "integer 12345"',
                          () => {
                              this.#checkValue_getIntegerFormat( 12345, "12,345" );
                          }
                    );

                    test( 'Then it returns "-12,345" on parameter value equal to "integer -12345"',
                          () => {
                              this.#checkValue_getIntegerFormat( -12345, "-12,345" );
                          }
                    );

                    test( 'Then it returns "123,456" on parameter value equal to "float 123456.123"',
                          () => {
                              this.#checkValue_getIntegerFormat( 123456.123, "123,456" );
                          }
                    );

                    test( 'Then it returns "123,457" on parameter value equal to "float 123456.789"',
                          () => {
                              this.#checkValue_getIntegerFormat( 123456.789, "123,457" );
                          }
                    );

                    test( 'Then it returns "-123,457" on parameter value equal to "float -123456.789"',
                          () => {
                              this.#checkValue_getIntegerFormat( -123456.789, "-123,457" );
                          }
                    );

                    test( 'Then it returns "-123,456" on parameter value equal to "float -123456.123"',
                          () => {
                              this.#checkValue_getIntegerFormat( -123456.123, "-123,456" );
                          }
                    );

                    test( 'Then it returns "NaN" on parameter value equal to "string \'123456.789\'"',
                          () => {
                              this.#checkValue_getIntegerFormat( "123,456.789", "NaN" );
                          }
                    );

                    test( 'Then it returns "0" on parameter value equal to "empty array"',
                          () => {
                              this.#checkValue_getIntegerFormat( [], "0" );
                          }
                    );

                    test( 'Then it returns "NaN" on parameter value equal to "[ 1, 2, 3 ]"',
                          () => {
                              this.#checkValue_getIntegerFormat( [ 1, 2, 3 ], "NaN" );
                          }
                    );

                    test( 'Then it returns "NaN" on parameter value equal to "empty object"',
                          () => {
                              this.#checkValue_getIntegerFormat( {}, "NaN" );
                          }
                    );
                }
            },
            {
                describe: 'When function "yearMonthDayDashDateFormat" was called',
                then: () => {
                    test('Then "yearMonthDayDashDateFormat" format date correctly',
                            () => {
                                const date = new Date('Tue Aug 20 2024 18:25:41 GMT-0500 (Central Daylight Time)');
                                const formattedDate = yearMonthDayDashDateFormat(date);
                                expect(formattedDate).toEqual('2024-08-20');
                            }
                    );
                }
            },
            {
                describe: 'When function "getBlankZeroFormatter" was called',
                then: () => {
                    test('Then "getBlankZeroFormatter" returns an empty string for falsy values',
                            () => {
                                expect(getBlankZeroFormatter('', (v) => v.value)).toEqual('');
                            }
                    );
                    test('Then "getBlankZeroFormatter" returns an empty string for 0 values',
                        () => {
                            expect(getBlankZeroFormatter(0, (v) => v.value)).toEqual('');
                        }
                    );
                    test('Then "getBlankZeroFormatter" returns an empty string for undefined values',
                        () => {
                            expect(getBlankZeroFormatter(undefined, (v) => v.value)).toEqual('');
                        }
                    );
                    test('Then "getBlankZeroFormatter" returns a formatted value when value is different than 0 or falsy',
                        () => {
                            expect(getBlankZeroFormatter(200, (v) => `$${v.value}`)).toEqual('$200');
                        }
                    );
                }
            },
        ];
    }


    #checkValue_hasNoLength( value, expectation ) {

        const resultValue = hasNoLength( value );

        expect( resultValue ).toEqual( expectation );
    }


    #checkValue_getIntegerFormat( value, expectation ) {

        let resultValue;
        let errorThrown = false;

        try {

            resultValue = getIntegerFormat( value );

        } catch( e ) {

            errorThrown = true;
        }

        if( expectation === undefined ) {

            expect( errorThrown ).toBeTruthy();

        } else {

            expect( errorThrown ).toBeFalsy();
            expect( resultValue ).toEqual( expectation );
        }
    }


};
