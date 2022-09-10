import { Component, OnInit, ElementRef, ViewChild, Inject } from "@angular/core";
import { Subscription, fromEvent } from "rxjs";
import { UploadService, SessionType } from "../services/upload.service";
import { DOCUMENT } from "@angular/common";
import { MatSelect } from "@angular/material/select";
import { ApplicationInsightsService } from "../application-insights.service";
import { MsalBroadcastService, MsalService } from "@azure/msal-angular";
import { ToastrService } from "ngx-toastr";
import { ConfigService } from "../config.service";
import { AuthenticationResult, EventMessage, EventType } from "@azure/msal-browser";
import { filter } from "rxjs/operators";
import { DefaultConfig } from "../models/defaultconfig";
import { AppComponent } from "../app.component";

@Component({
  selector: "app-receive",
  templateUrl: "./receive.component.html",
  styleUrls: ["./receive.component.css"]
})
export class ReceiveComponent implements OnInit {
  document: Document;
  copyClicked = false;
  @ViewChild("password") password: ElementRef;
  @ViewChild("sessionName") sessionName: ElementRef;
  @ViewChild("retention") retention: MatSelect;

  subscribed: any;
  subscription: Subscription;
  loggedIn = false;
  isIframe: boolean;
  isIE: any;

  loginDisplay: boolean;

  constructor(
    @Inject(DOCUMENT) document: Document,
    public uploadService: UploadService,
    appInsights: ApplicationInsightsService,
    private msalBroadcastService: MsalBroadcastService,
    private toastr: ToastrService,
    private authService: MsalService,
    public configService: ConfigService,
    public appcomponent: AppComponent,
    public defaultConfig: DefaultConfig
  ) {
    this.document = document;

    // resetting the session
    uploadService.session = null;

    appInsights.logPageView("receive");
  }

  ngOnInit(): void {
    const sessionType: SessionType = SessionType.Receive;


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

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }
}
