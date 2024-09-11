import React from 'react';
import { Button } from '@lwt-helix/buttons';
import { ButtonDropdown } from '@lwt-helix/dropdown';
import { agentProductionTerms, buttonTerms } from '../../../constants';

const ExportShareButtons = props => {

    let exportButton = null;
    const buttonProps = {
        dataLwtId: 'export',
        color: 'secondary',
        className: 'bg-dark export-share-button btn-sm mr-1',
        disabled: props.isExportDisabled,
        hidden: props.isHidden
    };
    if (props.showExportButton) {
        exportButton = (<Button {...buttonProps} onClick={props.exportCsv}>{buttonTerms.export}</Button>);
    }

    return (<>
        {exportButton}
        {props.showShareButton && <ButtonDropdown
            className={'export-share-button'}
            dataLwtId="share-options"
            toggleProps={{
                dataLwtId: 'no-split-toggle',
                id: 'caret',
                color: 'secondary',
                caret: true,
                children: agentProductionTerms.share,
                className: 'bg-dark btn btn-secondary btn-sm'
            }}
            items={[
                {
                    dataLwtId: 'no-split-item1',
                    itemText: agentProductionTerms.downloadPdf,
                    key: 'item_1'
                },
                { dataLwtId: 'no-split-item2', divider: true, key: 'item_2' },
                {
                    dataLwtId: 'no-split-item3',
                    itemText: agentProductionTerms.copyShareableLink,
                    key: 'item_3'
                }
            ]}
            menuProps={{
                dataLwtId: 'share-menu',
                right: true
            }}
        />}
    </>);
};

export default ExportShareButtons;
