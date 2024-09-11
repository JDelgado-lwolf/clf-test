import React from 'react';
import PropTypes from 'prop-types';
import { components as ReactSelectComponents } from 'react-select';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { pencil } from '@lwt-helix/helix-icon/outlined';
import { Button } from '@lwt-helix/buttons';
import { chipIconProps } from '../../../../../helpers/chips';
import { modalKeys } from '../../../../../helpers/menu';

const AreaSelect = (props) => {
    const { marketAreaLists, showEditModal, data } = props;
    return (<>
        <div {...props} className='d-flex flex-column bg-red'>
            <div className='d-flex saved-list-option'>
                <ReactSelectComponents.Option {...props}>
                    <span className='flex-grow-1' style={{ whiteSpace: 'pre-wrap' }}> {data.label} </span>
                </ReactSelectComponents.Option>
                {marketAreaLists?.map(list => list.id).includes(data.value) && <Button
                    dataLwtId='edit-market-area-list'
                    size='xs'
                    color='light'
                    className='text-capitalize show-on-parent-hover'
                    id='edit-area-list'
                    onClick={() => showEditModal(modalKeys.dropdown, data.value)}
                    style={{ marginBottom: '8px', padding: 0, float: 'right' }}
                >
                    <HelixIcon icon={pencil} {...chipIconProps} title='edit icon' />
                </Button>
                }
            </div>
        </div>
    </>);
};

AreaSelect.propTypes = {
    marketAreaLists: PropTypes.array,
    showEditModal: PropTypes.func,
    data: PropTypes.object
};

export default AreaSelect;
