// noinspection JSUnusedLocalSymbols

import { MockCallProhibited, MockNotImplemented } from "./helper";


let mockUser = null;


jest.mock( "../../src/service/service-gateway", () =>
    (
        {
            ...jest.requireActual( "../../src/service/service-gateway" ),
            //@formatter:off
            sendApiRequest                      : jest.fn().mockImplementation(  async() => MockCallProhibited()  ),
            getAgentInfoDetail                  : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            getOfficeInfoDetail                 : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            updateSavedSearch                   : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            deleteSavedSearch                   : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            saveCustomArea                      : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            updateSavedMarketArea               : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            getSearchesByAreaId                 : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            deleteSavedMarketArea               : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            saveOfficeSearchList                : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            updateSavedOfficeList               : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            deleteSavedOfficeList               : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            getSearchesByOfficeListId           : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            saveAgentSearchList                 : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            updateSavedAgentList                : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            getSearchesByAgentListId            : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            getSearchesByAreaListId             : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            deleteSavedAgentList                : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            getCoverageOfficeBreakdownList      : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            getOfficeBreakdownList              : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            getListingBreakdown                 : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            getCoverageListingBreakdown         : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            getBreakdownOfficeDetails           : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            getListingDetailRequest             : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            getListingHistoryRequest            : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            getAgentListingDetailDrillDown      : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            getAgentHistory                     : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            getAgentInventoryHistory            : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            getAgentTransactionCoverage         : jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            getAgentTransactionCoverageDrillDown: jest.fn().mockImplementation(  async() => MockNotImplemented()  ),
            //@formatter:on
        }
    )
);


export function MockServiceGateway( user ) {
    mockUser = user;
};
