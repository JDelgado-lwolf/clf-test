import { BaseTestSuite } from "../../../BaseTestSuite";
import { moduleNames } from '../../../../src/constants';
import { getUserProducts } from '../../../../src/common/helpers/userPrivileges';

export class TestUserPrivileges extends BaseTestSuite {
    arrange() {
        super.arrange();
        this.given = 'Given a module "common/helpers/pendo.js"';

        this.when = [
            ...this.when,
            {
                describe: 'When getUserProducts() is called as a legacy user',
                then: () => {
                    test('Then the function returns the expected values', () => {
                        const result = getUserProducts({ isLegacyUser: true });
                        expect(result.length).toEqual(1);
                        expect(result.includes(moduleNames.proficiencyMetrics)).toEqual(true);
                    });
                },
            },
            {
                describe: 'When getUserProducts() is called as a legacy user with extra permissions',
                then: () => {
                    test('Then the function returns the expected values', () => {
                        const result = getUserProducts({
                            isLegacyUser: true,
                            privileges: [ moduleNames.marketShare ]
                        });
                        expect(result.length).toEqual(1);
                        expect(result.includes(moduleNames.proficiencyMetrics)).toEqual(true);
                    });
                },
            },
            {
                describe: 'When getUserProducts() is called with an empty object',
                then: () => {
                    test('Then the user has perms to no products', () => {
                        const result = getUserProducts({ } );
                        expect(result.length).toEqual(0);
                    });
                },
            },
            {
                describe: 'When getUserProducts() is called as a non-Legacy user with null privileges',
                then: () => {
                    test('Then the user has perms to no products', () => {
                        const result = getUserProducts({ privileges: null });
                        expect(result.length).toEqual(0);
                    });
                },
            },
            {
                describe: 'When getUserProducts() is called as a non-Legacy user with market share and market dynamics',
                then: () => {
                    test('Then the user has perms to the corresponding products', () => {
                        const result = getUserProducts({
                            privileges: {
                                userProducts: [ moduleNames.marketShare, moduleNames.marketDynamics ]
                            }
                        });
                        expect(result.length).toEqual(2);
                        expect(result.includes(moduleNames.proficiencyMetrics)).toEqual(false);
                        expect(result.includes(moduleNames.marketShare)).toEqual(true);
                        expect(result.includes(moduleNames.marketDynamics)).toEqual(true);
                    });
                },
            },
            {
                describe: 'When getUserProducts() is called as a non-Legacy user with market share, market dynamics, and prof metrics',
                then: () => {
                    test('Then the user has perms to the corresponding products', () => {
                        const result = getUserProducts({
                            privileges: {
                                userProducts: [ moduleNames.marketShare, moduleNames.marketDynamics, moduleNames.proficiencyMetrics ]
                            }
                        });
                        expect(result.length).toEqual(3);
                        expect(result.includes(moduleNames.proficiencyMetrics)).toEqual(true);
                        expect(result.includes(moduleNames.marketShare)).toEqual(true);
                        expect(result.includes(moduleNames.marketDynamics)).toEqual(true);
                    });
                },
            },
        ];
    }
}
