import React, { useRef } from 'react';
import { CSVLink } from 'react-csv';
import { Button } from '@lwt-helix/buttons';
import { agentProductionTerms } from '../../../constants';

export const exportButtonDefaultProps = {
  dataLwtId: 'export',
  color: 'secondary',
  className: 'bg-dark export-share-button m-0 btn-sm mr-1',
  disabled: true,
  isVisible: false
};

const ExportButton = props => {

  const { headers, data = '', filename, isVisible } = props;
  const csvLink = useRef();

  if (!isVisible) return null;

  const handleDirectExportClick = () => {
    csvLink.current?.link?.click();
  };

  return <>
    <Button {...exportButtonDefaultProps}
            disabled={data?.length === 0}
            onClick={handleDirectExportClick}>
      {agentProductionTerms.export}
    </Button>

    {headers && data && filename &&
        <CSVLink
            headers={headers}
            data={data}
            ref={csvLink}
            filename={filename}
            className='hidden'
            target='_blank' />
    }
  </>
};

export default ExportButton;
