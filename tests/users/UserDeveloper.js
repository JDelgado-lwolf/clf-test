// noinspection HttpUrlsUsage,SpellCheckingInspection

import { UserBase } from "./UserBase";

const token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJqMmREOFd0azI2TVJ2djd5eE9RckNPMXRvalFjU3QyUGxjcU1CNml6RFhzIn0.eyJleHAiOjE2OTY5OD" +
              "czODEsImlhdCI6MTY5Njk1MTM4MywiYXV0aF90aW1lIjoxNjk2OTUxMzgxLCJqdGkiOiI4NTNlMDI3Zi00YjIzLTRhYzUtODAzZi1iZTZiYjM4YWQyZDQiLCJpc3MiOiJo" +
              "dHRwczovL3hibS1pZC5kZXYudGVycmFkYXR1bS5jb20vYXV0aC9yZWFsbXMvdGVycmFkYXR1bSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI2OTNkZDNmMS02Mzg4LTRmZm" +
              "EtYWY3Ny05NTZiYTU0NmFhNDEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhZXJnbyIsIm5vbmNlIjoiYjBiNzU0MWYtNTM1Zi00MGUzLWJkMTEtZWJlMGI1YWIwYmEyIiwi" +
              "c2Vzc2lvbl9zdGF0ZSI6IjgwNzdlNTY3LTY3ODQtNDA3OS04MjE0LTc0ZDI2NzVjMjE4OSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2Jyb2tlcm" +
              "1ldHJpY3MuZGV2Lmx3b2xmLmNvbSIsImh0dHBzOi8vYnJva2VybWV0cmljcy5kZXYubHdvbGYuY29tIiwiaHR0cDovL2NsZi1hZXJnby1jbGllbnQuZGV2LnRlcnJhZGF0" +
              "dW0uY29tIiwiaHR0cDovL2xvY2FsaG9zdC8iLCJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJodHRwczovL2NsZi1hZXJnby1jbGllbnQuZGV2LnRlcnJhZGF0dW0uY29tIi" +
              "wiaHR0cHM6Ly94Ym0taWQuZGV2LnRlcnJhZGF0dW0uY29tIiwiaHR0cHM6Ly9zZXJ2aWNlLWdhdGV3YXkuZGV2LnRlcnJhZGF0dW0uY29tIiwiaHR0cHM6Ly9hcGkuZGV2" +
              "LnRlcnJhZGF0dW0uY29tIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3" +
              "MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQi" +
              "LCJuYW1lIjoiQm9yaXMgVGNpcGxpYWV2IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYnRjaXBsaWFldkBsd29sZi5jb20iLCJnaXZlbl9uYW1lIjoiQm9yaXMiLCJmYW1pbH" +
              "lfbmFtZSI6IlRjaXBsaWFldiIsImVtYWlsIjoiYnRjaXBsaWFldkBsd29sZi5jb20ifQ.AvBxOlrOL7PqfHp1WzjJtX_1hggT8mfUQayTc9mpHAlibB3mpFI61D_Ys7IRx" +
              "iA_kP_VnfixR5jeyIbZ8GrpFqbdxlCg3vHi469hKIXDQXTmnyvVITrH82u8tr0sV7HitQE4AgWCCjJtVjPSG0H7KxLat-Qd3B2yEAaY3pula7BMtA6OLN_aTGw7s6AxfWO" +
              "nHeMfxbmDD0LSbXYazhebs3JJMBbH9_85eIfanyK1tCN0sqv5CTXY0s8vNaFtGaqdr5IOP705RDLp7VX_X9xmrq8xxOeMqSSeW5gDxdV17AJq9CjPDhfheNSxURK3c8u4p" +
              "GvtNtiFFVNBiyJvT7yOug";

const tokenInfo = {
    "exp"               : 1696987381,
    "iat"               : 1696951383,
    "auth_time"         : 1696951381,
    "jti"               : "853e027f-4b23-4ac5-803f-be6bb38ad2d4",
    "iss"               : "https://xbm-id.dev.terradatum.com/auth/realms/terradatum",
    "aud"               : "account",
    "sub"               : "693dd3f1-6388-4ffa-af77-956ba546aa41", "typ": "Bearer",
    "azp"               : "aergo",
    "nonce"             : "b0b7541f-535f-40e3-bd11-ebe0b5ab0ba2",
    "session_state"     : "8077e567-6784-4079-8214-74d2675c2189",
    "acr"               : "1",
    "allowed-origins"   : [
        "http://brokermetrics.dev.lwolf.com",
        "https://brokermetrics.dev.lwolf.com",
        "http://clf-aergo-client.dev.terradatum.com",
        "http://localhost/",
        "http://localhost:5000",
        "https://clf-aergo-client.dev.terradatum.com",
        "https://xbm-id.dev.terradatum.com",
        "https://service-gateway.dev.terradatum.com",
        "https://api.dev.terradatum.com"
    ],
    "realm_access"      : {
        "roles": [
            "offline_access",
            "uma_authorization"
        ]
    },
    "resource_access"   : {
        "account": {
            "roles": [
                "manage-account",
                "manage-account-links",
                "view-profile"
            ]
        }
    },
    "scope"             : "openid",
    "name"              : "Boris Tcipliaev",
    "preferred_username": "btcipliaev@lwolf.com",
    "given_name"        : "Boris",
    "family_name"       : "Tcipliaev",
    "email"             : "btcipliaev@lwolf.com"
};

const userProfile = {
    "accessibleOfficeList": [
        { "mlsId": 1, "officeId": "ACLBA02" },
        { "mlsId": 1, "officeId": "ACLBA04" },
        { "mlsId": 1, "officeId": "ACLBA06" },
    ],
    "agentList"           : [],
    "isSetupActive"       : true,
    "isUserActive"        : true,
    "mlsList"             : [ 78, 235, 20, 268, 351 ],
    "userName"            : "BORIS EC"
};

const mlsMembership = [
    {
        "bankInvolvementStatus"  : "D",
        "firstAvailableDate"     : "2009-08-20T18:18:54",
        "isActive"               : true,
        "lastSuccessfulUpdate"   : "2023-10-16T00:04:22",
        "licensingStatement"     : "",
        "longDescription"        : "Bay Area Real Estate Information Services",
        "mlsId"                  : 1,
        "shortDescription"       : "BAREIS",
        "supports13Quarters"     : true,
        "supportsBaths"          : true,
        "supportsBeds"           : true,
        "supportsCdom"           : true,
        "supportsDom"            : true,
        "supportsLotSizeAcres"   : true,
        "supportsLotSizeSqft"    : true,
        "supportsNewConstruction": true,
        "supportsSquareFootage"  : true,
        "supportsYearBuilt"      : true
    },
    {
        "bankInvolvementStatus"  : "D",
        "firstAvailableDate"     : "2009-08-20T18:18:54",
        "isActive"               : true,
        "lastSuccessfulUpdate"   : "2023-10-15T22:32:23",
        "licensingStatement"     : "",
        "longDescription"        : "Midwest Real Estate Data",
        "mlsId"                  : 2,
        "shortDescription"       : "MRED",
        "supports13Quarters"     : true,
        "supportsBaths"          : true,
        "supportsBeds"           : true,
        "supportsCdom"           : true,
        "supportsDom"            : true,
        "supportsLotSizeAcres"   : false,
        "supportsLotSizeSqft"    : false,
        "supportsNewConstruction": true,
        "supportsSquareFootage"  : true,
        "supportsYearBuilt"      : true
    },
    {
        "bankInvolvementStatus"  : "D",
        "firstAvailableDate"     : "2009-08-20T18:18:54",
        "isActive"               : true,
        "lastSuccessfulUpdate"   : "2023-10-16T00:10:28",
        "licensingStatement"     : "",
        "longDescription"        : "MLSListings, Inc.",
        "mlsId"                  : 3,
        "shortDescription"       : "MLSLSTNGS",
        "supports13Quarters"     : true,
        "supportsBaths"          : true,
        "supportsBeds"           : true,
        "supportsCdom"           : false,
        "supportsDom"            : false,
        "supportsLotSizeAcres"   : false,
        "supportsLotSizeSqft"    : false,
        "supportsNewConstruction": true,
        "supportsSquareFootage"  : true,
        "supportsYearBuilt"      : true
    },
];

export class UserDeveloper extends UserBase {

    constructor() {

        super();

        this._token         = token;
        this._tokenInfo     = tokenInfo;
        this._userProfile   = userProfile;
        this._mlsMembership = mlsMembership;
    }
};
