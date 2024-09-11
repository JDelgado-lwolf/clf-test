import React from 'react';
import Card, { CardContainer } from '@lwt-helix/card';
import { SummaryCard } from './SummaryCard';

export const SummaryRow = props => {

    const { title, cardData } = props;

    return <>
        <div className="mb-3">
            <CardContainer
                dataLwtId="summary-row-title"
                type="group">
                <Card
                    dataLwtId="title"
                    className="rounded-0 text-center mb-0"
                    bodyProps={{
                        className: 'p-2',
                        children: <>
                            <div className="text-center w-100 py-2 mb-0 card-header border-0 super-header">
                                {title}
                            </div>
                        </>
                    }}
                />
            </CardContainer>

            <CardContainer
                dataLwtId="summary-row-detail"
                type="group">
                {cardData?.map(({ id, value }, index) =>
                    <SummaryCard
                        key={index}
                        id={id}
                        value={value}
                    />
                )}
            </CardContainer>
        </div>
    </>;
};
