export class AuthConfig {
    useAuthentication: boolean;
    "clientId": string;
    "tenantId": string;
    get authority() {
        return `https://login.microsoftonline.com/${this.tenantId}`;
    }
    "validateAuthority": boolean;
    "redirectUri": string;
    "postLogoutRedirectUri": string;
    "navigateToLoginRequestUrl": boolean;
    subscriptionId: string;
    instance: string;
    admin: string;
    adminUserEmail: string;

    constructor() { }
}
