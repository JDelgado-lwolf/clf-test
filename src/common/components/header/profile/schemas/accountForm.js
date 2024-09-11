export const accountSchema = {
    type: 'object',
    properties: {
        firstName: {
            type: 'string'
        },
        lastName: {
            type: 'string'
        },
        username: {
            type: 'string'
        },
        email: {
            type: 'string'
        }
    }
};

export const accountUiSchema = {
    firstName: {
        'ui:autofocus': 'true',
        'lwolf:classNames': 'col-md-6',
        classNames: 'form-group',
        'ui:title': 'First Name',
        'ui:disabled': true
    },
    lastName: {
        'lwolf:classNames': 'col-md-6',
        classNames: 'form-group',
        'ui:title': 'Last Name',
        'ui:disabled': true
    },
    username: {
        'lwolf:classNames': 'col-md-12',
        classNames: 'form-group',
        'ui:title': 'Username',
        'ui:disabled': true
    },
    email: {
        'lwolf:classNames': 'col-md-12',
        classNames: 'form-group',
        'ui:title': 'Email',
        'ui:disabled': true
    },
    'ui:order': [
        '*'
    ],
    'lwolf:rows': [
        [
            'firstName',
            'lastName'
        ],
        [
            'username'
        ],
        [
            'email'
        ]
    ]
};
