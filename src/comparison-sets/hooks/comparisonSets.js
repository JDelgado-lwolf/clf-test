import { useEffect, useMemo, useState } from "react";
import { useComparisonSetsStore } from "../../store/comparisonSets/store";
import { useCommonStore } from "../../store/store";

export const useComparisonSets = () => {
    const { mlsList, userInfo, membership } = useCommonStore(
        ({mlsList, userInfo, membership}) => ({
            mlsList,
            userInfo,
            membership
        }),
    );
    const mlsListOptions = useMemo(() => {
        const currentMlsList = mlsList || membership;
        return !!currentMlsList?.length && currentMlsList.filter(mls => mls.isActive).map(mls => ({
            value: mls,
            label: `(${mls.shortDescription}) ${mls.longDescription}`
        }))
    }, [mlsList, membership]);

    const defaultMlsOption = mlsListOptions[0];

    const initialState = {
        isSaveButtonDisabled: true,
        newCompSetName: undefined,
    };

    const [state, setState] = useState({...initialState});

    const {
        selectedMls,
        getComparisonSetsByUser,
        handleMlsChange,
        buildComparisonSetOptions,
        selectedComparisonSet,
        getSelectedComparisonSetOfficesList,
        comparisonSets
    } = useComparisonSetsStore(state => ({
        getComparisonSetsByUser: state.getComparisonSetsByUser,
        handleMlsChange: state.handleMlsChange,
        buildComparisonSetOptions: state.buildComparisonSetOptions,
        selectedComparisonSet: state.selectedComparisonSet,
        getSelectedComparisonSetOfficesList: state.getSelectedComparisonSetOfficesList,
        comparisonSets: state.comparisonSets
    }));

    useEffect(() => {
        if (selectedMls) return;
        handleMlsChange(defaultMlsOption);
    }, []);

    useEffect(() => {
        if (!userInfo?.id) return;
        getComparisonSetsByUser(userInfo.id);
    }, [userInfo.id]);

    useEffect(() => {
        buildComparisonSetOptions();
    }, [comparisonSets]);

    useEffect(() => {
        getSelectedComparisonSetOfficesList();
    }, [selectedComparisonSet]);

    return {
        state,
        setState,
        mlsListOptions,
        defaultMlsOption,
    };
};
