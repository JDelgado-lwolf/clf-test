import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { star as starOutlined } from '@lwt-helix/helix-icon/outlined';
import { star as starSolid } from '@lwt-helix/helix-icon/solid';
import { useCommonStore, useSearchStore, useSavedAgentsStore } from '../../../../store/store';
import {
    popoverTerms
} from '../../../../agent-production/constants/agentProductionConstants';
import { setStateData } from '../../../helpers/state';
import { cssClassNames } from '../../../../constants/css';

const FavoriteAgent = props => {
    const { colDef, node } = props;
    const tableId = colDef?.cellRendererParams?.tableId;

    const {
        agentLists,
        removeAgentListsCheckedValues,
        addAgentListsCheckedValues,
        clearAgentListPopover
    } = useCommonStore(state => ({
        agentLists: state.agentLists,
        removeAgentListsCheckedValues: state.removeAgentListsCheckedValues,
        addAgentListsCheckedValues: state.addAgentListsCheckedValues,
        clearAgentListPopover: state.clearAgentListPopover,
    }));

    const {search, selectedModule } = useSearchStore(state => ({
            search: state[state.selectedModule]?.search,
            selectedModule: state.selectedModule,
        })
    );
    const selectedList = useSavedAgentsStore(
        state => state.selectedListByModule[selectedModule],
    );

    const mlsId = search?.mlsId || (!!agentLists?.length && selectedList?.mlsId);

    const [state, setState] = useState({
        savedAgentLists: agentLists
    });

    const showSavedAgentLists = () => {
        state.savedAgentLists.map(list => {
            if(list.agentIds.includes(node.data?.agentId)) {
                addAgentListsCheckedValues(list?.agentListId);
            } else {
                removeAgentListsCheckedValues(list?.agentListId);
            }
        });
    };

    const handleStarClick = () => {
        showSavedAgentLists();
        const popoverData = {
            agentId: node.data?.agentId,
            rowIndex: node.data?.rank,
            tableId,
            popoverIsOpen: true
        };
        useCommonStore.setState({ popoverDataForAddAgentList: popoverData });
    };

    useEffect(() => {
        setStateData('savedAgentLists', agentLists?.filter(list => list?.mlsId === mlsId), setState);
    }, [agentLists]);

    const renderStarIcon = () => {
        const currentMlsSavedAgentLists = state.savedAgentLists?.filter(list => list.mlsId === mlsId);
        const isAgentInSavedAgentLists = currentMlsSavedAgentLists?.find(list => {
            return !!list.agentIds.includes(node.data.agentId);
        });
        const startContainerId = popoverTerms.starIcon(tableId, node.data?.rank);
        const starIcon = isAgentInSavedAgentLists ? starSolid : starOutlined;
        return (
            <div id={startContainerId} className={cssClassNames.centeredChildren}>
                <HelixIcon
                    icon={starIcon}
                    onClick={handleStarClick}
                />
            </div>
        );
    };

    return (
        <>
            {renderStarIcon()}
        </>
    );
};

FavoriteAgent.propTypes = {
    colDef: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired
};

export default FavoriteAgent;
