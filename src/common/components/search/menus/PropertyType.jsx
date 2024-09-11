import React, { useEffect, useState } from 'react';
import * as _ from 'lodash-es';
import Select from '@lwt-helix/select';
import { ListGroup, ListGroupItem } from '@lwt-helix/list-group';
import { CustomInput } from '@lwt-helix/controls';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { search } from '@lwt-helix/helix-icon/outlined';
import { validationMessages } from '../../../../constants';
import { setStateData } from '../../../helpers/state';

const PropertyType = (props) => {
    const { setPropTypes, toggleInvalid, initialPropTypes, module, invalid, propTypes } = props;

    const initialState = {
        propTypes: [],
        propTypeHash: {},
        propTypesCount: 0,
        selectedPropTypes: initialPropTypes,
        groupedOptions: [],
        validationMessage: undefined
    };

    const [state, setState] = useState({ ...initialState });

    useEffect(() => {
        if (module) {
            let propTypeHash = {};
            const groupedOptions = [];
            if (propTypes) {
                _.forEach(propTypes, (propType) => {
                    propTypeHash[propType.classId] = _.map(propType.types, (t) => t.typeId);
                    groupedOptions.push({
                        label: propType.longName,
                        options: _.map(propType.types, (type) => ({ value: type.typeId, label: type.longName }))
                    });
                });

                const propTypesCount = _.sum(_.flatMap(propTypeHash, (x) => x.length));
                setState({
                    ...state,
                    propTypes,
                    propTypeHash,
                    propTypesCount,
                    groupedOptions
                });
            }
        }
    }, [propTypes]);

    useEffect(() => {
        if (state.selectedPropTypes) {
            if (state.selectedPropTypes.length === 0) {
                setState(prevState => ({
                    ...prevState,
                    validationMessage: validationMessages.propertyTypesNoSelectionError
                }));
                toggleInvalid();
            } else {
                setState(prevState => ({
                    ...prevState,
                    validationMessage: undefined
                }));
            }
            setPropTypes(state.selectedPropTypes);
        }
    }, [state.selectedPropTypes]);

    const groupStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    };

    const toggleSelectAll = (e) => {
        setStateData('selectedPropTypes', e.target.checked ? _.flatMap(state.propTypeHash, (x) => x) : [], setState);
    };

    const isAllClassTypesSelected = (classId) => _.intersection(state.propTypeHash[classId], state.selectedPropTypes || []).length === state.propTypeHash[classId].length;

    const toggleClassSelection = (e) => {
        const classId = e.target.id.split('class-').join('');
        const selectedPropTypes = e.target.checked
            ? _.union([...state.selectedPropTypes || []], [...state.propTypeHash[classId]])
            : _.difference([...state.selectedPropTypes || []], [...state.propTypeHash[classId]]);

        setStateData('selectedPropTypes', selectedPropTypes, setState);
    };

    const updateTypeSelection = (typeId, condition) => {
        let selectedPropTypes = [...state.selectedPropTypes || []];
        if (condition) {
            selectedPropTypes.push(typeId);
        } else {
            selectedPropTypes = _.pull(selectedPropTypes, typeId);
        }
        setStateData('selectedPropTypes', selectedPropTypes, setState);
    };

    const toggleTypeSelection = (e) => {
        const typeId = Number(e.target.id);
        const condition = e.target.checked;
        updateTypeSelection(typeId, condition);
    };

    const onTypeSelection = (type) => {
        const typeId = type.value;
        const condition = (!state.selectedPropTypes || state.selectedPropTypes?.indexOf(typeId) === -1);
        updateTypeSelection(typeId, condition);
    };

    const formatGroupLabel = (data) => (
        <div style={groupStyles}>
            <span>{data.label}</span>
        </div>
    );

    const propTypesList = () => {
        const childItems = (classId, types) => (
            types.map((type) =>
                <ListGroupItem className='border-0 ml-4 py-1'>
                    <CustomInput dataLwtId={type.typeId}
                                 type='checkbox'
                                 defaultChecked={true}
                                 checked={!!state.selectedPropTypes?.length && state.selectedPropTypes.indexOf(type.typeId) !== -1}
                                 label={type.longName}
                                 id={type.typeId}
                                 onClick={toggleTypeSelection} />
                </ListGroupItem>
            )
        );

        return (
            state.propTypes.map((propType) => {
                if (propType.types.length > 0) {
                    return (<>
                            <ListGroupItem className='border-0 py-1'>
                                <CustomInput dataLwtId={propType.classId}
                                             type='checkbox'
                                             defaultChecked={true}
                                             checked={isAllClassTypesSelected(propType.classId)}
                                             label={propType.longName}
                                             id={`class-${propType.classId}`}
                                             onClick={toggleClassSelection} />
                            </ListGroupItem>
                            <ListGroup flush={true}>
                                {childItems(propType.classId, propType.types)}
                            </ListGroup>
                        </>
                    );
                } else {
                    return (
                        <>
                            <ListGroup flush={true}>
                                {childItems(propType.types)}
                            </ListGroup>
                        </>
                    );
                }
            })
        );
    };

    return (<>
        <Select
            placeholder={
                <>
                    <HelixIcon icon={search} className='align-top mr-1' title='search icon' /> Search property types
                </>
            }
            formatGroupLabel={formatGroupLabel}
            options={state.groupedOptions}
            className='mb-2'
            onChange={onTypeSelection}
            matchFrom='start'
            autoFocus={true}
            isClearable={false}
            value={null}
        />

        <ListGroup flush={true} className='border-0 mb-1'>
            <ListGroupItem className='border-0 py-1 pb-2'>
                <CustomInput dataLwtId='select-deselect-all'
                             type='checkbox'
                             defaultChecked={true}
                             checked={!!state.selectedPropTypes?.length && state.selectedPropTypes.length === state.propTypesCount}
                             label='Select/Deselect All'
                             id='select-deselect-all'
                             onClick={toggleSelectAll} />
            </ListGroupItem>
        </ListGroup>

        <ListGroup
            flush={true}
            style={{ maxHeight: '250px', overflowY: 'auto' }}
            className={`form-control ${invalid && 'is-invalid'}`}
        >
            {propTypesList()}
        </ListGroup>

        {state.validationMessage &&
        <div className='text-danger p-2' style={{ whiteSpace: 'pre-wrap' }}>{state.validationMessage}</div>
        }
    </>);
};

export default PropertyType;
