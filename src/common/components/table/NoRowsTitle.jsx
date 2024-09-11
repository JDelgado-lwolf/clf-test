import React from 'react';

const NoRowsTitle = ({ message }) => {
    return (
        <p className="no-search-results font-weight-bold">
            {message}
        </p>
    );
 };

 export default NoRowsTitle;
