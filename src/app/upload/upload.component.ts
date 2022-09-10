import { Component, OnInit, ViewChild, AfterViewChecked, AfterViewInit } from '@angular/core';
import { ActivatedRoute, RouteConfigLoadEnd } from '@angular/router';
import { UploadService } from '../services/upload.service';
import { UploaderComponent } from '../uploader/uploader.component';
import { ApplicationInsightsService } from '../application-insights.service';
import { DefaultConfig } from '../models/defaultconfig';
import { SessionStatus, Session } from '../models/session';
import { SessionType } from "../services/upload.service";
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit, AfterViewInit {

  @ViewChild("upload") upload: UploaderComponent;
  sessionId: string;
  session: Session;
  deleted: boolean;

  constructor(private route: ActivatedRoute,
    public uploadService: UploadService,
    public appInsights: ApplicationInsightsService,
    public defaultConfig: DefaultConfig,
    private scroller: ViewportScroller,
  ) {

    appInsights.logPageView("upload");
  }

  ngOnInit() {
    this.route.params.subscribe(x => {
      this.sessionId = x.id;
      this.uploadService.getSession(this.sessionId).subscribe(session => {
        this.uploadService.session = session;
        this.session = session;

        if (this.session.status === SessionStatus.Deleted) {
          this.deleted = true;
        }
      });
    });
  }

  ngAfterViewInit(): void {
    this.upload.OnAllUploadComplete.subscribe(() => {
      setTimeout(() => {
        this.scroller.scrollToAnchor('destination');
      }, 250);
    });
  }
}
