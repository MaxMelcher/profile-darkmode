import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';

import { UploadService } from './services/upload.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from './shared/shared.module';
import { TranslateModule, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IPublicClientApplication, PublicClientApplication, InteractionType, BrowserCacheLocation, LogLevel } from '@azure/msal-browser';
import { MsalGuard, MsalInterceptor, MsalBroadcastService, MsalInterceptorConfiguration, MsalModule, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular'; // Redirect component imported from msal-angular

import { ConfigService } from './config.service';

import { NotfoundComponent } from './notfound/notfound.component';

import { DateFnsModule } from 'ngx-date-fns';
import { MsalRedirectComponent } from './MsalRedirectComponent';
import { TranslationService } from './services/translation.service';
import { DefaultConfig } from './models/defaultconfig';
import { AuthConfig } from './models/authconfig';
import { ApplicationInsightsService } from './application-insights.service';
import { MissingTranslationHelper } from './MissingTranslationHandler';

export let configService = new ConfigService();
export let authConfig;
export let defaultConfig;

export function getAuthConfig(): AuthConfig {
  try {
    const request = new XMLHttpRequest();
    request.open('GET', "/api/file/authConfig", false);  // request application settings synchronous
    request.send(null);

    const response = JSON.parse(request.responseText);
    authConfig = response;
  }
  catch
  {
    authConfig = new AuthConfig();
  }
  return authConfig;

}

export function getConfigService(authConfig: AuthConfig): ConfigService {

  configService.config.auth = authConfig;
  configService.useAuthentication = authConfig.useAuthentication;

  //only rewrite the protected urls if auth is required.
  if (configService.config.auth && configService.useAuthentication) {
    configService.protectedUrls.forEach(x => {
      x.push(`api://${configService.config.auth.clientId}/user.read`);
    });
    configService.angularConfig.protectedResourceMap = new Map(configService.protectedUrls);
  }

  return configService;
}

export function getDefaultConfig() {
  try {
    const request = new XMLHttpRequest();
    request.open('GET', "/api/file/defaultConfig", false);  // request application settings synchronous
    request.send(null);
    const response = JSON.parse(request.responseText);
    defaultConfig = response;
  }
  catch
  {
    defaultConfig = new DefaultConfig();
  }
  return defaultConfig;
}

export function ConfigureApplicationInsightsService(config: DefaultConfig) {
  var ais = new ApplicationInsightsService(config.instrumentationKey, config.useTelemetry);
  return ais;
}

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export function loggerCallback(logLevel: LogLevel, message: string) {
}

export function MSALInstanceFactory(): IPublicClientApplication {

  getConfigService(authConfig);

  return new PublicClientApplication({
    auth: {
      clientId: configService.config.auth.clientId,
      redirectUri: configService.config.auth.redirectUri,
      postLogoutRedirectUri: configService.config.auth.postLogoutRedirectUri,
      authority: configService.config.auth.authority
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false
      }
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {

  let protectedResourceMap = new Map<string, Array<string>>();

  protectedResourceMap = configService.protectedUrls;

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return { interactionType: InteractionType.Redirect };
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    NotfoundComponent,
    MsalRedirectComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    FormsModule,
    ReactiveFormsModule,
    MsalModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'receive', loadChildren: () => import('./receive/receive.module').then(m => m.ReceiveModule) },
      { path: '**', component: NotfoundComponent },
    ]
      , { preloadingStrategy: PreloadAllModules }),
    BrowserAnimationsModule,
    SharedModule,


    DateFnsModule.forRoot(),


    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslationService,
        deps: [HttpClient, DefaultConfig]
      },
      isolate: false,
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingTranslationHelper },
    })
  ],
  providers: [
    {
      provide: ApplicationInsightsService,
      useFactory: ConfigureApplicationInsightsService,
      deps: [DefaultConfig]
    },
    CookieService,
    UploadService,
    {
      provide: DefaultConfig,
      useFactory: getDefaultConfig,
    },
    {
      provide: AuthConfig,
      useFactory: getAuthConfig,
    },
    {
      provide: ConfigService,
      useFactory: getConfigService,
      deps: [AuthConfig]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
      deps: [AuthConfig]
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    {
      provide: ConfigService,
      useValue: configService
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule {
}
