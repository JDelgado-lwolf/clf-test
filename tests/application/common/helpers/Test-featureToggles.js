import { BaseTestSuite } from "../../../BaseTestSuite";
import {
    getIsComparisonSetsEnabled,
    getIsMDOfficeBreakdownEnabled,
    getIsTrendAnalysisDebugEnabled
} from '../../../../src/common/helpers/featureToggles';
import { environments } from '../../../../src/common/helpers/environment';
import { ACCOUNTS } from "../../../../src/constants";

export class TestFeatureToggles extends BaseTestSuite {
    arrange() {
        super.arrange();
        this.NOT_LONEWOLF_INTERNAL_ACCOUNT_ID = 1;
        this.given = 'Given a module "common/helpers/featureToggles.js"';

        this.when = [
            ...this.when,
            {
                describe: 'When getIsComparisonSetsEnabled() is called for Broker metrics',
                then: () => {
                    test('Then the function returns true', () => {
                        Object.defineProperty(window, 'location', {
                            value: { host: 'brokermetrics.lwolf.com' },
                            writable: true
                        });
                        const result = getIsComparisonSetsEnabled();
                        expect(result).toEqual(true);
                    });
                },
            },
        ];
        this.when = [
            ...this.when,
            {
                describe: 'When getIsComparisonSetsEnabled() is called for Agent metrics',
                then: () => {
                    test('Then the function returns false', () => {
                        Object.defineProperty(window, 'location', {
                            value: { host: 'agentmetrics.lwolf.com' },
                            writable: true
                        });
                        const result = getIsComparisonSetsEnabled();
                        expect(result).toEqual(false);
                    });
                },
            },
        ];
        this.when = [
            ...this.when,
            {
                describe: 'When getIsTrendAnalysisDebugEnabled() is called with an enviro where debug is not enabled',
                then: () => {
                    test('Then the function returns false', () => {
                        const hideDebugIn = [ environments.PRE ]
                        const isDebugEnabled = getIsTrendAnalysisDebugEnabled('brokermetrics.stg.lwolf.com', hideDebugIn);
                        expect(isDebugEnabled).toEqual(true);
                    });
                },
            },
        ];
        this.when = [
            ...this.when,
            {
                describe: 'When getIsTrendAnalysisDebugEnabled() is called with an enviro where debug is enabled',
                then: () => {
                    test('Then the function returns false', () => {
                        const hideDebugIn = [ environments.PRE, environments.STG ]
                        const isDebugEnabled = getIsTrendAnalysisDebugEnabled('brokermetrics.stg.lwolf.com', hideDebugIn);
                        expect(isDebugEnabled).toEqual(false);
                    });
                },
            },
        ];
        this.when = [
            ...this.when,
            {
                describe: 'When getIsMDOfficeBreakdownEnabled() is called with the Lone Wolf Account ID',
                then: () => {
                    test('Then the function returns true', () => {
                        const result = getIsMDOfficeBreakdownEnabled(ACCOUNTS.LONE_WOLF_INTERNAL.id);
                        expect(result).toEqual(true);
                    });
                },
            },
        ];
        this.when = [
            ...this.when,
            {
                describe: 'When getIsMDOfficeBreakdownEnabled() is called with an ID which is not the Lone Wolf Account ID',
                then: () => {
                    test('Then the function returns false', () => {
                        const result = getIsMDOfficeBreakdownEnabled(this.NOT_LONEWOLF_INTERNAL_ACCOUNT_ID);
                        expect(result).toEqual(false);
                    });
                },
            },
        ];
        this.when = [
            ...this.when,
            {
                describe: 'When getIsMDOfficeBreakdownEnabled() is called with undefined',
                then: () => {
                    test('Then the function returns false', () => {
                        const result = getIsMDOfficeBreakdownEnabled();
                        expect(result).toEqual(false);
                    });
                },
            },
        ];
    }
}
