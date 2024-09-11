// noinspection JSUnusedLocalSymbols

import { MockNotImplemented } from "./helper";


let mockUser = null;


jest.mock( "../../src/service/savedLists", () =>
    (
        {
            ...jest.requireActual( "../../src/service/savedLists" ),
            //@formatter:off
            getUserSavedSearches: jest.fn().mockImplementation(  async( ownerId, module, searchType ) => mockUser.userSavedSearches  ),
            getMarketAreaLists  : jest.fn().mockImplementation(  async( ownerId )                     => mockUser.marketAreaLists    ),
            getOfficeLists      : jest.fn().mockImplementation(  async( ownerId )                     => mockUser.officeLists        ),
            getAgentLists       : jest.fn().mockImplementation(  async( ownerId )                     => mockUser.agentLists         ),
            updateSearchUsage   : jest.fn().mockImplementation(  async( savedSearchId )               => MockNotImplemented()        ),
            //@formatter:on
        }
    )
);


export function MockSavedLists( user ) {
    mockUser = user;
};
