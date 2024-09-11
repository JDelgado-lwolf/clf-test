import jwt_decode from 'jwt-decode';


const defaultUserAccounts   = {
    'accounts': [
        {
            'accountActive': true,
            'accountType'  : 'Internal',
            'description'  : 'Lone Wolf Internal Users',
            'id'           : 2,
            'name'         : 'Lone Wolf Internal',
            'userActive'   : true,
            'userType'     : 'Internal'
        }
    ],
    'user'    : {
        'email'    : 'btcipliaev@lwolf.com',
        'firstName': 'Boris',
        'id'       : 956,
        'lastName' : 'Tcipliaev'
    }
};
const defaultUserPrivileges = {
    'accountOffices': [
        {
            'mlsId'    : 69,
            'officeIds': [
                '3446'
            ]
        },
        {
            'mlsId'    : 101,
            'officeIds': [
                'ZIONLUXURY'
            ]
        },
        {
            'mlsId'    : 347,
            'officeIds': [
                '177'
            ]
        }
    ],
    'userProducts'  : [
        'PROFICIENCY_METRICS',
        'MARKET_SHARE',
        'MARKET_DYNAMICS'
    ]
};

const defaultUserProfile       = { isSetupActive: false, isUserActive: false };
const defaultOfficeInfo        = { error: true };
const defaultMlsMembership     = [];
const defaultMarketAreaLists   = { areas: [] };
const defaultOfficeLists       = { list: [] };
const defaultAgentLists        = [];
const defaultUserSavedSearches = { savedSearches: [] };
const defaultTimeIntervals     = [
    {
        intervalType: 'MTD',
        last        : { from: '2023-10-01T00:00:00', to: '2023-10-15T23:59:59' },
        lastYear    : { from: '2022-10-01T00:00:00', to: '2022-10-15T23:59:59' },
        previous    : { from: '2023-09-01T00:00:00', to: '2023-09-15T23:59:59' }
    },
    {
        intervalType: 'QTD',
        last        : { from: '2023-10-01T00:00:00', to: '2023-10-15T23:59:59' },
        lastYear    : { from: '2022-10-01T00:00:00', to: '2022-10-15T23:59:59' },
        previous    : { from: '2023-07-01T00:00:00', to: '2023-07-15T23:59:59' }
    },
    {
        intervalType: 'YTD',
        last        : { from: '2023-01-01T00:00:00', to: '2023-10-15T23:59:59' },
        lastYear    : { from: '2022-01-01T00:00:00', to: '2022-10-15T23:59:59' },
        previous    : { from: '2022-01-01T00:00:00', to: '2022-10-15T23:59:59' }
    },
    {
        intervalType: 'Monthly',
        last        : { from: '2023-09-01T00:00:00', to: '2023-09-30T23:59:59' },
        lastYear    : { from: '2022-09-01T00:00:00', to: '2022-09-30T23:59:59' },
        previous    : { from: '2023-08-01T00:00:00', to: '2023-08-31T23:59:59' }
    },
    {
        intervalType: 'Last6Months',
        last        : { from: '2023-04-01T00:00:00', to: '2023-09-30T23:59:59' },
        lastYear    : { from: '2022-04-01T00:00:00', to: '2022-09-30T23:59:59' },
        previous    : { from: '2022-10-01T00:00:00', to: '2023-03-31T23:59:59' }
    },
    {
        intervalType: 'Annually',
        last        : { from: '2022-10-01T00:00:00', to: '2023-09-30T23:59:59' },
        lastYear    : { from: '2021-10-01T00:00:00', to: '2022-09-30T23:59:59' },
        previous    : { from: '2021-10-01T00:00:00', to: '2022-09-30T23:59:59' }
    },
    {
        intervalType: 'Last24Months',
        last        : { from: '2021-10-01T00:00:00', to: '2023-09-30T23:59:59' },
        lastYear    : { from: '2020-10-01T00:00:00', to: '2022-09-30T23:59:59' },
        previous    : { from: '2019-10-01T00:00:00', to: '2021-09-30T23:59:59' }
    },
    {
        intervalType: 'LastCalendarYear',
        last        : { from: '2022-01-01T00:00:00', to: '2022-12-31T23:59:59' },
        lastYear    : { from: '2021-01-01T00:00:00', to: '2021-12-31T23:59:59' },
        previous    : { from: '2021-01-01T00:00:00', to: '2021-12-31T23:59:59' }
    }
];


export class UserBase {

    constructor() {

        //  Comments are structured as "Module" - "Function" - "End-point". Path is relative, based on "tests" directory.

        this._token             = '';
        this._tokenInfo         = null;
        this._userAccounts      = defaultUserAccounts;          //  ../src/service/account     -  getUserAccounts       -  profile_user_get_by_email
        this._userPrivileges    = defaultUserPrivileges;        //  ../src/service/account     -  getUserPrivileges     -  user_account_privileges
        this._userProfile       = defaultUserProfile;           //  ../src/service/account     -  getUserProfile        -  User_profile
        this._officeInfo        = defaultOfficeInfo;            //  ../src/service/mlsInfo     -  getOfficeInfo         -  Office_info
        this._mlsMembership     = defaultMlsMembership;         //  ../src/service/mlsInfo     -  getMlsMembership      -  Multiple_MLS_info
        this._marketAreaLists   = defaultMarketAreaLists;       //  ../src/service/savedLists  -  getMarketAreaLists    -  Areas_filter
        this._officeLists       = defaultOfficeLists;           //  ../src/service/savedLists  -  getOfficeLists        -  OfficeList_get
        this._agentLists        = defaultAgentLists;            //  ../src/service/savedLists  -  getAgentLists         -  Agent_lists
        this._userSavedSearches = defaultUserSavedSearches;     //  ../src/service/savedLists  -  getUserSavedSearches  -  Searches_MLS_Member
        this._timeIntervals     = defaultTimeIntervals;         //  ../src/service/misc        -  getTimeIntervals      -  Time_interval_descriptions
    }


    get token() {
        return this._token;
    }


    get tokenInfo() {

        if( !this._tokenInfo ) {

            this._tokenInfo = jwt_decode( this._token );

            const debugString = ( typeof this._tokenInfo === 'object' )
                                ? JSON.stringify( this._tokenInfo )
                                : this._tokenInfo;

            console.debug( debugString );
        }

        return this._tokenInfo;
    }


    get userAccounts() {
        return this._userAccounts;
    }


    get userPrivileges() {
        return this._userPrivileges;
    }

    get userProfile() {
        return this._userProfile;
    }


    get officeInfo() {
        return this._officeInfo;
    }


    get mlsMembership() {
        return this._mlsMembership;
    }


    get marketAreaLists() {
        return this._marketAreaLists;
    }


    get officeLists() {
        return this._officeLists;
    }


    get agentLists() {
        return this._agentLists;
    }


    get userSavedSearches() {
        return this._userSavedSearches;
    }


    get timeIntervals() {
        return this._timeIntervals;
    }


};
