import { useEffect, useState } from 'react';
import * as _ from 'lodash-es';
import { modules } from '../../constants';
import { getAreasMap, getPropertyTypes } from '../../service/mlsInfo';
import { useSearchStore } from '../../store/store';
import { getOfficesByModule } from '../helpers/search';

export const useMls = (mlsId, selectedModule) => {
    const [propTypes, setPropTypes] = useState({});
    const [mappedAreas, setMappedAreas] = useState({});
    const [offices, setOffices] = useState({});

    const setIsLoading = useSearchStore(state => state.setIsLoading);

    const fetchMlsProperties = async (mlsId, selectedModule) => {
        if (mlsId && selectedModule) {
            //propTypes
            //every module except offices
            if (!propTypes[mlsId] && selectedModule !== modules.proficiencyMetrics.offices) {
                const propertyTypesResponse = await getPropertyTypes(mlsId);
                if (!propertyTypesResponse.error) {
                    const sorted = _.sortBy(propertyTypesResponse, [o => o.classId]);
                    _.forEach(sorted, o => o.types = _.sortBy(o.types, [t => t.typeId]));
                    setPropTypes({
                        ...propTypes,
                        [mlsId]: sorted
                    });
                }
            }

            //areasMap
            //every module 
            if (!mappedAreas[mlsId]) {
                const mappedAreasResponse = await getAreasMap(mlsId);
                if (!mappedAreasResponse.error) {
                    setMappedAreas({
                        ...mappedAreas,
                        [mlsId]: mappedAreasResponse
                    });
                }
            }

            //offices
            //offices, coverage only
            if (!offices[mlsId] && [modules.proficiencyMetrics.offices, modules.marketShare.coverage].includes(selectedModule)) {
                const officesResponse = await getOfficesByModule(mlsId)[selectedModule]();
                if (!officesResponse.error) {
                    setOffices({
                        ...offices,
                        [mlsId]: officesResponse
                    });
                }
            }
        }
    };

    useEffect(async () => {
        setIsLoading(true);
        mlsId && selectedModule && await fetchMlsProperties(mlsId, selectedModule);
        setIsLoading(false);
    }, [mlsId, selectedModule]);

    return {
        propTypes: mlsId && propTypes[mlsId],
        mappedAreas: mlsId && mappedAreas[mlsId],
        offices: mlsId && offices[mlsId]
    };
};
