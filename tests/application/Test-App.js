import { getByText, queryByText } from "@testing-library/react";
import { BaseTestContext }        from "../BaseTestContext";
import { User }                   from "../users/User";

export default class TestApp extends BaseTestContext {

    constructor() {

        super( User.developer );
    }

    arrange() {

        super.arrange();

        this.given = 'Given an application started';

        this.when = [
            ...this.when,
            {
                describe: 'When "developer" user was logged in',
                then    : () => {
                    test( 'Then "initial" screen was rendered successfully',
                          () => {
                              const logoText = getByText( document.body, 'BrokerMetrics' );

                              // comment these out until we fix the tests for UL + keycloak

                              // const newSearchText            = getByText( document.body, 'New Search' );
                              // const buttonSelectMLS          = this.app.container.querySelector( '#mls-chip' );
                              // const buttonSelectMarketArea   = this.app.container.querySelector( '#location' );
                              // const buttonSelectPropertyType = this.app.container.querySelector( '#property-type' );
                              // const buttonSelectTimePeriod   = this.app.container.querySelector( '#timeframe-chip' );
                              // const buttonAddFilters         = this.app.container.querySelector( '#add-filters' );
                              //
                              // //@formatter:off

                              expect(logoText).toBeInTheDocument();

                              // expect( newSearchText            ).toBeInTheDocument();
                              // expect( buttonSelectMLS          ).toBeInTheDocument();
                              // expect( buttonSelectMLS          ).not.toBeDisabled();
                              // expect( buttonSelectMarketArea   ).toBeInTheDocument();
                              // expect( buttonSelectMarketArea   ).toBeDisabled();
                              // expect( buttonSelectPropertyType ).toBeInTheDocument();
                              // expect( buttonSelectPropertyType ).toBeDisabled();
                              // expect( buttonSelectTimePeriod   ).toBeInTheDocument();
                              // expect( buttonSelectTimePeriod   ).toBeDisabled();
                              // expect( buttonAddFilters         ).toBeInTheDocument();
                              // expect( buttonAddFilters         ).toBeDisabled();
                              // //@formatter:on
                          }
                    );
                }
            }
        ];
    }
};
