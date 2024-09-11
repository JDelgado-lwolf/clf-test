import React from 'react';
import PropTypes from 'prop-types';
import { components as ReactSelectComponents } from 'react-select';
import Select from '@lwt-helix/select';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { pencil } from '@lwt-helix/helix-icon/outlined';
import { useSavedAgentsStore, useSearchStore } from '../../../../../../store/store';
import { setStateData } from '../../../../../helpers/state';
import { Button } from '@lwt-helix/buttons';
import { modalKeys } from '../../../../../helpers/menu';
import { searchTerms } from '../../../../../../constants';

const AgentListsSelectRow = props => {
    const {
        setState,
        sortOptions,
        handleSortChange,
        setFilteredAgents,
        agentLists,
        selectAgentList,
        showEditModal,
        options,
        selectedSortOption
    } = props;

    const {
        selectedModule,
        resetSelectedAgentList,
    } = useSearchStore(state => ({
        selectedModule: state.selectedModule,
        resetSelectedAgentList: state.resetSelectedAgentList,
    }));

    const {
        setSelectedListByModule,
        getAgentListSelectedValue,
    } = useSavedAgentsStore(state => ({
        setSelectedListByModule: state.setSelectedListByModule,
        getAgentListSelectedValue: state.getAgentListSelectedValue,
    }));

    const formatGroupLabel = data =>  (
        data.label === searchTerms.myAgentLists && !!data.options.length && (
            <div className='border-bottom d-flex align-items-center'>
                <span className='select-options-group-label'>{data.label}</span>
            </div>
        )
    );

    const handleListChange = async option => {
        setState(prevState => ({
            ...prevState,
            addedAgents: undefined,
            availableAgents: undefined,
            initialSelectedAgents: undefined,
            initialSelectedList: undefined,
            selectedAgentList: undefined,
            agentSearchFilters: {}
        }));
        setFilteredAgents(undefined);
        if (option.value) {
            const agentList = agentLists.find(list => list.agentListId === option.value)
            selectAgentList(agentList);
            setSelectedListByModule(selectedModule, agentList);
        } else {
            resetSelectedAgentList();
            setStateData('selectedAgentList', undefined, setState);
            setSelectedListByModule(selectedModule, undefined);
        }
    };

    const components = () => {
        return {
            Option: (props) => {
                return (
                    <>
                        <div {...props} className='d-flex flex-column'>
                            <div
                                className={props.data.label === searchTerms.agents
                                    ? 'd-flex saved-list-option'
                                    : 'd-flex saved-list-option editable'
                                }
                            >
                                <ReactSelectComponents.Option {...props} className='chip-option clickable'>
                                    <span className='flex-grow-1 ' style={{
                                        whiteSpace: 'pre-wrap'
                                    }}>{props.data.label}</span>
                                </ReactSelectComponents.Option>
                                {props.data.label !== searchTerms.savedAgentList && <Button
                                    dataLwtId='edit-agent-list'
                                    size='xs'
                                    color='light'
                                    className='text-capitalize show-on-parent-hover mb-8 p-0 float-right'
                                    id='edit-agent-list'
                                    onClick={() => showEditModal(modalKeys.dropdown, props.data)}
                                >
                                    <HelixIcon icon={pencil} className='mr-1 align-top' title='edit icon' />
                                </Button>
                                }
                            </div>
                        </div>
                    </>
                );
            }
        };
    };

    return (
        <div className='w-100'>
            <div className='list-select-container'>
                <Select
                    placeholder={searchTerms.savedAgentList}
                    classNamePrefix='agent-list-search'
                    components={components()}
                    isClearable={false}
                    options={options}
                    formatGroupLabel={formatGroupLabel}
                    onChange={handleListChange}
                    value={getAgentListSelectedValue(options)}
                    autoFocus={true}
                    onlySearchLabel={true}
                    styles={{
                        option: baseStyles => ({
                            ...baseStyles,
                            textTransform: 'capitalize',
                            whiteSpace: 'pre'
                        }),
                        singleValue: baseStyles => ({
                            ...baseStyles,
                            textTransform: 'capitalize',
                            whiteSpace: 'pre'
                        })
                    }}
                />
            </div>
            <div className='sort-select-container'>
                <Select
                    options={sortOptions}
                    onChange={handleSortChange}
                    isClearable={false}
                    isSearchable={false}
                    defaultValue={selectedSortOption || sortOptions[0]}
                    className='agent-sort'
                />
            </div>
        </div>
    )
};

AgentListsSelectRow.propTypes = {
    setState: PropTypes.func,
    sortOptions: PropTypes.array,
    handleSortChange: PropTypes.func,
    setFilteredAgents: PropTypes.func,
    agentLists: PropTypes.array,
    selectAgentList: PropTypes.func,
    showEditModal: PropTypes.func,
    options: PropTypes.array,
    selectedSortOption: PropTypes.object,
};

export default AgentListsSelectRow;
