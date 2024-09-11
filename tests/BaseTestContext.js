import * as React                 from 'react';
import { MemoryRouter }           from 'react-router-dom';
import { cleanup, render }        from '@testing-library/react';
import userEvent                  from "@testing-library/user-event";
import { BaseTestSuite }          from "./BaseTestSuite";
import { User }                   from "./users/User";
import { MockAccount }            from "./mocks/mock-account";
import { MockMarketShare }        from "./mocks/mock-market-share";
import { MockMisc }               from "./mocks/mock-misc";
import { MockMlsInfo }            from "./mocks/mock-mlsInfo";
import { MockProficiencyMetrics } from "./mocks/mock-proficiency-metrics";
import { MockSavedLists }         from "./mocks/mock-savedLists";
import { MockServiceGateway }     from "./mocks/mock-service-gateway";
import App                        from "../src/App";
import { getKeyCloak }            from "../src/authentication/keycloak";
import { useCommonStore }         from "../src/store/store";


// noinspection JSUnusedGlobalSymbols
jest.mock( 'react-router-dom', () => ( {
    ...jest.requireActual( 'react-router-dom' ),
    useNavigate: () => jest.fn()
} ) );


jest.mock( 'keycloak-js', () => {
    // noinspection JSUnusedGlobalSymbols
    return jest.fn().mockImplementation( () => ( {
        ...jest.requireActual( 'keycloak-js' ),
        init: () => {}
    } ) );
} );


const keycloak = getKeyCloak();


export class BaseTestContext extends BaseTestSuite {

    app          = null;
    initialEntry = '/';

    constructor( userType ) {

        super();

        const mockUser = ( userType === undefined )
                         ? User.create( User.developer )
                         : User.create( userType );

        keycloak.token = mockUser.token;

        useCommonStore.setState( { token: mockUser.token, tokenInfo: mockUser.tokenInfo } );

        MockAccount( mockUser );
        MockMarketShare( mockUser );
        MockMlsInfo( mockUser );
        MockSavedLists( mockUser );
        MockMisc( mockUser );
        MockServiceGateway( mockUser );
        MockProficiencyMetrics( mockUser );
    }


    arrange() {

        this.beforeEach = [
            ...this.beforeEach,
            () => {
                const mockConsoleError = jest.spyOn( console, 'error' ).mockImplementation( () => {} );
                const mockConsoleWarn  = jest.spyOn( console, 'warn' ).mockImplementation( () => {} );

                this.app = render(
                    <MemoryRouter initialEntries={ [ this.initialEntry ] }>
                        <App keycloak={ keycloak }/>
                    </MemoryRouter>
                );

                mockConsoleError.mockClear();
                mockConsoleWarn.mockClear();
            }
        ];

        this.afterEach = [
            () => {
                cleanup();
            },
            ...this.afterEach
        ];
    }


    async userEventClick( element ) {

        await userEvent.click( element );

        //  Wait for "useEffect" changes to be flushed
        await new Promise(
            r => setTimeout( () => r(), 0 )
        );

    }

};
