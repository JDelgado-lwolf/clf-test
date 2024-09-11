import { BaseTestSuite } from "../../../BaseTestSuite";
import { environments, getEnvironment } from '../../../../src/common/helpers/environment';

export class TestEnvironment extends BaseTestSuite {
    arrange() {
        super.arrange();
        this.given = 'Given a module "common/helpers/environment.js"';

        this.when = [
            ...this.when,
            {
                describe: 'When getEnvironment() is called',
                then: () => {
                    test('Then it returns the DEV environment as appropriate', () => {
                        const result = getEnvironment('brokermetrics.DEV.lwolf.com');
                        expect(result).toEqual(environments.DEV);
                    });
                    test('Then it returns the STG environment as appropriate', () => {
                        const result = getEnvironment('brokermetrics.stg.lwolf.com');
                        expect(result).toEqual(environments.STG);
                    });
                    test('Then it returns the PRE environment as appropriate', () => {
                        const result = getEnvironment('brokermetrics.PRE.lwolf.com');
                        expect(result).toEqual(environments.PRE);
                    });
                    test('Then it returns the PROD environment as appropriate', () => {
                        const result = getEnvironment('brokermetrics.lwolf.com');
                        expect(result).toEqual(environments.PRD);
                    });
                    test('Then it returns the LOCALHOST environment as appropriate', () => {
                        const result = getEnvironment('localhost');
                        expect(result).toEqual(environments.LOCALHOST);
                    });
                    test('Then it returns the PROD environment for a random host name', () => {
                        const result = getEnvironment('random host name');
                        expect(result).toEqual(environments.PRD);
                    });
                },
            },
        ];
    }
}
