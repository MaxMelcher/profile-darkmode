import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';
import { InteractionType, Logger, LogLevel, InteractionStatus, AuthenticationResult, RedirectRequest, PopupRequest, EventMessage, EventType } from '@azure/msal-browser';
import { MsalBroadcastService, MsalService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { enUS, de } from "date-fns/esm/locale";
import { DateFnsConfigurationService } from 'ngx-date-fns';
import { DOCUMENT } from '@angular/common';
import { DefaultConfig } from './models/defaultconfig';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'app';
  environment: { production: boolean; version: string; host: string; };
  loggedIn: boolean;
  subscription: any;
  public isIframe: boolean;
  private readonly _destroying$ = new Subject<void>();
  loginDisplay: boolean;



  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    @Inject(DOCUMENT) private document: Document,
    private translate: TranslateService,
    private authService: MsalService,
    private cookieService: CookieService,
    private msalBroadcastService: MsalBroadcastService,
    public langConfig: DateFnsConfigurationService,
    public defaultConfig: DefaultConfig) {

    const browserLang = translate.getBrowserLang();
    if (browserLang.match(/de/)) {
      translate.setDefaultLang('de');
    }
    else {
      translate.setDefaultLang('us');
    }

    const lang = this.cookieService.get('lang');
    if (lang) {
      translate.use(lang);

      if (lang === "de") {
        langConfig.setLocale(de);
      }
      else {
        langConfig.setLocale(enUS);
      }
    }

    this.environment = environment;

    //  This is to avoid reload during acquireTokenSilent() because of hidden iframe
    this.isIframe = window !== window.parent && !window.opener;

    if (this.authService.instance.getAllAccounts().length > 0) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }

  checkAndSetActiveAccount() {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }


  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnInit() {

    this.authService.instance.setLogger(new Logger({
      logLevel: LogLevel.Verbose,
      loggerCallback: (level, msg, pii) => {  }
    }));

    this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
      })

    this.msalBroadcastService.msalSubject$
      .pipe(
        // Optional filtering of events.
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_FAILURE),
        takeUntil(this._destroying$)
      )
      .subscribe((result) => {
        
      });

    this.loadStylesheet();
  }

  loadStylesheet() {

    if (!this.defaultConfig.css) return;

    const head = this.document.getElementsByTagName('head')[0];
    const style = this.document.createElement('link');
    style.id = 'client-theme';
    style.rel = 'stylesheet';
    style.href = this.defaultConfig.css;

    head.appendChild(style);
  }

  ngOnDestroy(): void {
    this._destroying$.next(null);
    this._destroying$.complete();
  }

  login() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      } else {
        this.authService.loginPopup()
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
      } else {
        this.authService.loginRedirect();
      }
    }
  }
}
