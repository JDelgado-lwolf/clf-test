import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

const RedirectLink = ({shouldRedirect, linkProps, label}) => {
    if (!shouldRedirect) return <span>{label}</span>;

    return <Link {...linkProps}>{label}</Link>;
};

RedirectLink.propTypes = {
    shouldRedirect: PropTypes.bool,
    linkProps: PropTypes.object,
    label: PropTypes.string.isRequired,
};

export default RedirectLink;
