// noinspection JSUnusedLocalSymbols


let mockUser = null;


jest.mock( "../../src/service/misc", () =>
    (
        {
            ...jest.requireActual( "../../src/service/misc" ),
            //@formatter:off
            getTimeIntervals: jest.fn().mockImplementation(  async() => mockUser.timeIntervals  ),
            //@formatter:on
        }
    )
);


export function MockMisc( user ) {
    mockUser = user;
};
