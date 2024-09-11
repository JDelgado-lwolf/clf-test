import { BaseTestSuite } from '../../../BaseTestSuite';
import {
    filterItemByKeyfieldValue,
    getUpdatedObjectByKeyfield,
    searchForKeyfieldInProperties
} from '../../../../src/common/helpers/utilities';
import { personObject, personObjectResult, savedSearchCriteriaWithCS, savedSearchCriteriaWithoutCS } from '../data/utilities';

export class TestUtilities extends BaseTestSuite {
    arrange() {
        super.arrange();
        this.given = 'Given a module "common/helpers/utilities.js"';
        this.arrayWithMatch = [
            { id: 1 }, { id: 3 }
        ];

        this.list = [
            { id: 1 }, { id: 2 }, { id: 3 }
        ];
        this.keyfield = 'id';
        this.keyfieldValueToRemove = 2;

        this.when = [
            ...this.when,
            {
                describe: 'When function "filterItemByKeyfieldValue" was called',
                then: () => {
                    test('Then it filter the list correctly', () => {
                        const result = filterItemByKeyfieldValue(this.list, this.keyfield, this.keyfieldValueToRemove);
                        expect(result).toEqual(this.arrayWithMatch);
                    });
                },
            },
            {
                describe: 'When function "getUpdatedObjectByKeyfield" was called',
                then: () => {
                    test('Then it returns an object with the property "mlsObjectId" updated correctly', () => {
                      const result = getUpdatedObjectByKeyfield(savedSearchCriteriaWithCS, "mlsObjectId", undefined);
                      expect(result).toEqual(savedSearchCriteriaWithoutCS);
                    });
                    test('Then it returns an object with the property "sport" updated correctly', () => {
                        const valueToUpdate = {
                            approved: false,
                            score: 10,
                            teacher: {
                                private: false
                            }
                        };
                        const result = getUpdatedObjectByKeyfield(personObject, "sport", valueToUpdate);
                        expect(result).toEqual(personObjectResult);
                    });
                },
            },
            {
                describe: 'When function "searchForKeyfieldInProperties" was called',
                then: () => {
                    test('Then it returns an object with the property "sport" updated correctly', () => {
                        const valueToUpdate = {
                            approved: false,
                            score: 10,
                            teacher: {
                                private: false
                            }
                        };
                        const parsedObject = JSON.parse(JSON.stringify(personObject));
                        const getObjectUpdated = (object, keyfield, valueToUpdate) => {
                            searchForKeyfieldInProperties(object, keyfield, valueToUpdate)
                            return parsedObject;
                        };
                        expect(getObjectUpdated(parsedObject, "sport", valueToUpdate)).toEqual(personObjectResult);
                    });
                },
            },
        ];
    }
};
