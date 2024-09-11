// noinspection JSUnusedLocalSymbols

import { MockNotImplemented } from "./helper";


let mockUser = null;


jest.mock( "../../src/service/proficiency-metrics", () =>
    (
        {
            ...jest.requireActual( "../../src/service/proficiency-metrics" ),
            //@formatter:off
            getProficiencyMetrics: jest.fn().mockImplementation(  async( criteria ) => MockNotImplemented()   ),
            //@formatter:on
        }
    )
);


export function MockProficiencyMetrics( user ) {
    mockUser = user;
};
