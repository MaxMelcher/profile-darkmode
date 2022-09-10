import { Component, ViewChild, AfterViewInit, Inject, OnInit, OnDestroy } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { UploadService, SessionType } from '../services/upload.service';
import { UploaderComponent } from "../uploader/uploader.component";
import { ConfigService } from "../config.service";
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from "@azure/msal-angular";
import { DOCUMENT, ViewportScroller } from "@angular/common";
import { ApplicationInsightsService } from "../application-insights.service";
import { ToastrService } from "ngx-toastr";
import { DefaultConfig } from "../models/defaultconfig";
import { AuthenticationResult, EventMessage, EventType, InteractionType } from "@azure/msal-browser";
import { filter, takeUntil } from "rxjs/operators";
import { AppComponent } from "../app.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild("upload") upload: UploaderComponent;

  private readonly _destroying$ = new Subject<void>();

  subscription: Subscription;
  showPassword;
  loggedIn = false;
  loginDisplay: boolean;

  constructor(
    private uploadService: UploadService,
    public configService: ConfigService,
    public auth: MsalService,
    @Inject(DOCUMENT) public document: Document,
    @Inject(AppComponent) private appcomponent /*used in html*/,
    appInsights: ApplicationInsightsService,
    private toastr: ToastrService,
    private msalBroadcastService: MsalBroadcastService,
    private authService: MsalService,
    public defaultConfig: DefaultConfig,
    private scroller: ViewportScroller,
    private router: Router
  ) {
    // resetting the session
    uploadService.session = null;
    appInsights.logPageView("home");
  }

  ngOnInit() {

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
        this.setLoginDisplay();
      });

    this.setLoginDisplay();
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

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngAfterViewInit() {
    this.upload.OnAllUploadComplete.subscribe(() => {
      setTimeout(() => {
        this.scroller.scrollToAnchor("destination");
      }, 250);
    });
  }

  ngOnDestroy(): void {
    this._destroying$.next(null);
    this._destroying$.complete();
  }
}
