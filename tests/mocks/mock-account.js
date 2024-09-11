// noinspection JSUnusedLocalSymbols

import { MockNotImplemented } from "./helper";


let mockUser = null;


jest.mock( "../../src/service/account", () =>
    (
        {
            ...jest.requireActual( "../../src/service/account" ),
            //@formatter:off
            getUserAccounts  : jest.fn().mockImplementation(  async( email )             => mockUser.userAccounts   ),
            getUserPrivileges: jest.fn().mockImplementation(  async (accountId, userId ) => mockUser.userPrivileges ),
            getUserProfile   : jest.fn().mockImplementation(  async( username )          => mockUser.userProfile    ),
            //@formatter:on
        }
    )
);


export function MockAccount( user ) {
    mockUser = user;
};
