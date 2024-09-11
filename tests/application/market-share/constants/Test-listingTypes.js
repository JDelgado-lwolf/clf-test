import { BaseTestSuite } from '../../../BaseTestSuite';
import { listingStatuses } from '../../../../src/market-share/constants/listingStatuses';
import { getCurrentListingType } from '../../../../src/market-share/constants/listingTypes';
import { listingTypes } from '../../../../src/market-share/constants/index';

export class TestListingTypesHelper extends BaseTestSuite {
    arrange() {
        super.arrange();
        this.given = 'Given a module "market-share/constants/listingTypes.js"';

        this.when = [
            ...this.when,
            {
                describe: 'When function "getCurrentListingType" was called',
                then: () => {
                    test(
                        'Then "getCurrentListingType" responds properly with ByOffice as Listing Type id',
                        () => {
                            const listingType = getCurrentListingType(
                                listingTypes.byOffice.id,
                                listingStatuses["Total Sold (List + Sell)"]
                            );
                            expect(listingType).toMatchObject(listingTypes.byOffice);
                        }
                    );
                    test(
                        'Then "getCurrentListingType" responds properly with ByBrokerage as Listing Type id',
                        () => {
                            const listingType = getCurrentListingType(
                                listingTypes.byBrokerage.id,
                                listingStatuses["Total Sold (List + Sell)"]
                            );
                            expect(listingType).toMatchObject(listingTypes.byBrokerage);
                        }
                    );
                    test(
                        'Then "getCurrentListingType" responds properly with comparisonSet as Listing Type id',
                        () => {
                            const listingType = getCurrentListingType(
                                listingTypes.comparisonSet.id,
                                listingStatuses["Total Sold (List + Sell)"],
                                false
                            );
                            expect(listingType).toMatchObject(listingTypes.comparisonSet);
                        }
                    );
                    test(
                        'Then "getCurrentListingType" return a default Listing Type with null value as Listing Type Id',
                        () => {
                            const listingType = getCurrentListingType(
                                null,
                                listingStatuses["Total Sold (List + Sell)"],
                                false
                            );
                            expect(listingType).toMatchObject(listingTypes.byOffice);
                        }
                    );
                    test(
                        'Then "getCurrentListingType" return Comparison Set as listing type with null value as Listing Type Id',
                        () => {
                            const listingType = getCurrentListingType(null, listingStatuses["Total Sold (List + Sell)"], true);
                            const expectedSoldBothSideObject = listingTypes.comparisonSet;
                            expect(listingType).toMatchObject(expectedSoldBothSideObject);
                        }
                    );
                }
            },
        ];
    }
};
