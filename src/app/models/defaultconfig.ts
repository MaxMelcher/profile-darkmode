export class DefaultConfig {
    allowedRetentions: string;
    allowedFileSize = 0;
    allowedFileExtensions = "";
    admin = "";
    adminUserEmail: string;
    baseUrl: string;
    cleanupPII: number;
    logo: string;
    logoTop: string;
    css: string;
    languageFolder: string;
    languages: string;
    useEmail: boolean;
    instrumentationKey: string;
    useTelemetry: boolean;
    enforcePassword: boolean;
    constructor() { }
}
