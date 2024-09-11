import React from 'react';
import PropTypes from 'prop-types';
import SchemaTable from '@lwt-helix/schema-table';
import Card from '@lwt-helix/card';
import AgentCard from '../agentSlideout/AgentCard';

const AgentChart = ({ options, schema, data, currentAgentChart }) => {
    const bodyProps = {
        children: <AgentCard
            selectedAgent={!!currentAgentChart && currentAgentChart}
            nameBold={false}
            border={false}
            mlsId={'mls-id-coming-soon'}
            module={module}
        />
    };

    return (
        <div className='d-flex row'>
            <div className='mb-3 col-md-6 col-sm-12 col-lg-6 col-xl-4'>
                <SchemaTable
                    id='chartTableList'
                    dataLwtId='ChartTableList'
                    options={options}
                    schema={schema}
                    data={data}
                />
            </div>
            <div className='col-md-6 col-sm-12 col-lg-6 col-xl-8'>
                <Card raised bodyProps={bodyProps} />
            </div>
        </div>
    );
};

AgentChart.propTypes = {
    options: PropTypes.object,
    schema: PropTypes.object,
    data: PropTypes.arrayOf(PropTypes.object)
};

export default AgentChart;
