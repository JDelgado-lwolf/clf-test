import React from 'react';
import MLSSelector from './MLSSelector';
import { useCommonStore, useSavedAgentsStore, useSearchStore } from '../../../../store/store';

const MLSSearch = (props) => {
    const { mlsProviders, initialMlsId, module, togglePopover } = props;

    const timeIntervals = useCommonStore(state => state.timeIntervals);

    const {
        resetSearchCriteria,
        setSelectedMls
    } = useSearchStore(state => ({
        resetSearchCriteria: state.resetSearchCriteria,
        setSelectedMls: state.setSelectedMls
    }));

    const { setSelectedListByModule } = useSavedAgentsStore(state => ({
        setSelectedListByModule: state.setSelectedListByModule,
    }));

    const handleSelectChange = async (option) => {
        const newMlsId = parseInt(option.mlsId);
        if (newMlsId !== initialMlsId) {
            togglePopover();
            resetSearchCriteria();
            setSelectedListByModule(module, undefined);
            await setSelectedMls(mlsProviders.find(mls => mls.mlsId === newMlsId), module, timeIntervals);
        }
    };

    return (
        <div style={{ minWidth: '300px' }}>
            {mlsProviders?.length > 0 ? (
                <>
                    <MLSSelector
                        handleSelectChange={handleSelectChange}
                        mlsProviders={mlsProviders}
                        selectedMlsId={initialMlsId}
                    />
                </>
            ) : (
                <div className='text-danger p-2' style={{ whiteSpace: 'pre-wrap' }}>
                    You don’t have an associated MLS.
                </div>
            )}
        </div>
    );
};

export default MLSSearch;
