import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { filter, takeUntil } from 'rxjs/operators';
import { InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { AuthConfig } from '../models/authconfig';
import { DateFnsConfigurationService } from 'ngx-date-fns';
import { enUS, de } from "date-fns/esm/locale";
import { DefaultConfig } from '../models/defaultconfig';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  user: string;
  email: string;
  private readonly _destroying$ = new Subject<void>();
  loginDisplay: boolean;
  languages: string[] = [];
  toggleDarkModeCheck = false;

  constructor(
    private translate: TranslateService,
    private cookieService: CookieService,
    private authService: MsalService,
    private broadcastService: MsalBroadcastService,
    public langConfig: DateFnsConfigurationService,
    public defaultConfig: DefaultConfig,
    public authConfig: AuthConfig,
    public titleService: Title,
    private router: Router) {
  }

  reload() {
    //get the current route
    const currentUrl = this.router.url;
    if (currentUrl == '/') {
      window.location.reload();
    }
    else {
      this.router.navigate(['/']);
    }
  }
  toggleDarkMode(){
    if(this.toggleDarkModeCheck){
      document.documentElement.setAttribute('theme', 'dark');
      this.cookieService.set('theme', 'dark');
    }
    else{
      document.documentElement.setAttribute('theme', '');
      this.cookieService.set('theme', '');
    }
  }
  ngOnInit() {
    var theme = this.cookieService.get('theme');
    if(theme && theme == 'dark'){
      this.toggleDarkModeCheck = true;
      this.toggleDarkMode()
    }

    this.router.events.subscribe(() => {
      //reset the title if we navigate
      this.resetTitle();
    });

    if (this.authService.instance.getAllAccounts().length > 0) {
      let account = this.authService.instance.getActiveAccount();
      if (account) {
        this.user = account.name;
        this.email = account.username;
      }
    }

    this.broadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      })

    this.resetTitle();

    var lang = this.defaultConfig.languages.split(",");
    this.languages.push(...lang);
  }

  resetTitle() {
    setTimeout(() => {
      var title = this.translate.instant("home.product");
      this.titleService.setTitle(title);
    }, 500);
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    this.email = this.authService.instance.getActiveAccount()?.username;
  }

  isAdmin() {

    if (this.authConfig.adminUserEmail.indexOf(this.authService.instance.getActiveAccount().username)) {
      return true;
    }
    return false;
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  setLanguage(lang: string) {
    this.translate.use(lang);

    this.cookieService.set('lang', lang, (new Date(8640000000000000).getFullYear()), null, null, true, 'Strict');

    if (lang === "de") {
      this.langConfig.setLocale(de);
    }
    else {
      this.langConfig.setLocale(enUS);
    }

  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this._destroying$.next(null);
    this._destroying$.complete();
  }
}
