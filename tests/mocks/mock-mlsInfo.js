// noinspection JSUnusedLocalSymbols

import { MockNotImplemented } from "./helper";


let mockUser = null;


jest.mock( "../../src/service/mlsInfo", () =>
    (
        {
            ...jest.requireActual( "../../src/service/mlsInfo" ),
            //@formatter:off
            getAgentInfo    : jest.fn().mockImplementation(  async( agentList )           => MockNotImplemented()    ),
            getOfficeInfo   : jest.fn().mockImplementation(  async( officeList )          => mockUser.officeInfo ),
            getMlsMembership: jest.fn().mockImplementation(  async( mlsIdList )           => mockUser.mlsMembership  ),
            getPropertyTypes: jest.fn().mockImplementation(  async( mlsId )               => MockNotImplemented()    ),
            getAreasMap     : jest.fn().mockImplementation(  async( mlsId )               => MockNotImplemented()    ),
            getAreasByType  : jest.fn().mockImplementation(  async( mlsId, areaType )     => MockNotImplemented()    ),
            getOffices      : jest.fn().mockImplementation(  async( mlsId )               => MockNotImplemented()    ),
            getMlsAgents    : jest.fn().mockImplementation(  async( mlsId, searchFields ) => MockNotImplemented()    ),
            //@formatter:on
        }
    )
);


export function MockMlsInfo( user ) {
    mockUser = user;
};
