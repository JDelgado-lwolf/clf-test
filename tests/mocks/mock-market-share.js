// noinspection JSUnusedLocalSymbols

import { MockNotImplemented } from "./helper";


let mockUser = null;


jest.mock( "../../src/service/market-share", () =>
    (
        {
            ...jest.requireActual( "../../src/service/market-share" ),
            //@formatter:off
            getTotalsOfficeSearch: jest.fn().mockImplementation(  async( criteria ) => MockNotImplemented()   ),
            getTotalsBrokerSearch: jest.fn().mockImplementation(  async( criteria ) => MockNotImplemented()   ),
            getCoverageSearch    : jest.fn().mockImplementation(  async( criteria ) => MockNotImplemented()   ),
            //@formatter:on
        }
    )
);


export function MockMarketShare( user ) {
    mockUser = user;
};
