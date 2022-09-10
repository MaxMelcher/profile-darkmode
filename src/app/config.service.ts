import { Injectable } from '@angular/core';
import { MsalInterceptorConfiguration } from '@azure/msal-angular';
import { Configuration, InteractionType, Logger, LogLevel } from '@azure/msal-browser';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {

  isIE =
    window.navigator.userAgent.indexOf("MSIE ") > -1 ||
    window.navigator.userAgent.indexOf("Trident/") > -1;

  emptyMap: [string, string[]][] = [];
  // urls that need a token if authentication is required
  protectedUrls: Map<string, Array<string>> = new Map([
    ['/api/file/createsession', []],
    ['/api/file/deletesession', []],
    ['/api/file/session/my', []], 
    ['/api/file/session/*/update', []],
    ['/api/file/testEmail', []],
  ]);

  config: Configuration = {
    auth: {
      clientId: "",
      authority: "",
      redirectUri: "https://localhost:5001/",
      postLogoutRedirectUri: "https://localhost:5001/",
      navigateToLoginRequestUrl: true,
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: this.isIE, // set to true for IE 11
    },
    system: {
      loggerOptions: {
        logLevel: LogLevel.Info,
        loggerCallback: loggerCallback, 
        piiLoggingEnabled: false
      }
    },
  };

  angularConfig: MsalInterceptorConfiguration = {
    interactionType: InteractionType.Redirect,
    protectedResourceMap: new Map(this.emptyMap)
  };
  useAuthentication: any;

  constructor() {
  }
}

export function loggerCallback(logLevel, message, piiEnabled) {
}

