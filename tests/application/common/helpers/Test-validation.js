import { BaseTestSuite } from "../../../BaseTestSuite";
import { getHasDuplicatedText, normalizeText } from '../../../../src/common/helpers/validation';

export class TestValidation extends BaseTestSuite {
    arrange() {
        super.arrange();
        this.given = 'Given a module "common/helpers/validation.js"';
        this.arrayWithoutMatch = [
            { "mlsId": 78, "name": "set 1" },
            { "mlsId": 78, "name": "set 2" },
            { "mlsId": 78, "name": "Set 3" }
        ];
        this.arrayWithMatch = [
            { "mlsId": 78, "name": "Test set" },
            { "mlsId": 78, "name": "set 1", },
            { "mlsId": 78, "name": "set 2" },
            { "mlsId": 78, "name": "set 3" }
        ];

        this.textFieldKey = 'name';
        this.searchTerm = ' tEst   Set ';
        this.selectedMlsId = 78;


        this.when = [
            ...this.when,
            {
                describe: 'When function "normalizeText" was called',
                then: () => {
                    test('Then it normalizes the text correctly', () => {
                        const result = normalizeText(this.searchTerm);
                        expect(result).toEqual('test set');
                    });
                },
            },
            {
                describe: 'When function "getHasDuplicatedText" was called',
                then: () => {
                    test('Then it returns true when a duplicate exists', () => {
                        const result = getHasDuplicatedText(this.arrayWithMatch, this.textFieldKey, this.searchTerm);
                        expect(result).toEqual(true);
                    });
                    test('Then it returns false when no duplicate exists', () => {
                        const result = getHasDuplicatedText(this.arrayWithoutMatch, this.textFieldKey, this.searchTerm);
                        expect(result).toEqual(false);
                    });
                },
            },
        ];
    }
}
