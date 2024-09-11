import { BaseTestSuite } from "../../../BaseTestSuite";
import { moduleNames } from '../../../../src/constants';
import { getProductFlags } from '../../../../src/common/helpers/pendo';

export class TestPendo extends BaseTestSuite {
    arrange() {
        super.arrange();
        this.given = 'Given a module "common/helpers/pendo.js"';

        this.when = [
            ...this.when,
            {
                describe: 'When getProductFlags() is called with an empty array',
                then: () => {
                    test('Then the function returns the expected values', () => {
                        const result = getProductFlags([]);
                        expect(result.has_proficiency_metrics).toEqual(false);
                        expect(result.has_market_share).toEqual(false);
                        expect(result.has_market_dynamics).toEqual(false);
                    });
                },
            },
            {
                describe: 'When getProductFlags() is called with proficiency metrics',
                then: () => {
                    test('Then the function returns the expected values', () => {
                        const result = getProductFlags([ moduleNames.proficiencyMetrics ]);
                        expect(result.has_proficiency_metrics).toEqual(true);
                        expect(result.has_market_share).toEqual(false);
                        expect(result.has_market_dynamics).toEqual(false);
                    });
                },
            },
            {
                describe: 'When getProductFlags() is called with market share',
                then: () => {
                    test('Then the function returns the expected values', () => {
                        const result = getProductFlags([ moduleNames.marketShare ]);
                        expect(result.has_proficiency_metrics).toEqual(false);
                        expect(result.has_market_share).toEqual(true);
                        expect(result.has_market_dynamics).toEqual(false);
                    });
                },
            },
            {
                describe: 'When getProductFlags() is called with market dynamics',
                then: () => {
                    test('Then the function returns the expected values', () => {
                        const result = getProductFlags([ moduleNames.marketDynamics ]);
                        expect(result.has_proficiency_metrics).toEqual(false);
                        expect(result.has_market_share).toEqual(false);
                        expect(result.has_market_dynamics).toEqual(true);
                    });
                },
            },
        ];
    }
}
