import { Component, OnInit, ViewChild, ElementRef, Inject, AfterViewInit, Input } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { tap, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UploadService, SessionType } from '../services/upload.service';
import { MatSelect } from '@angular/material/select';
import { UploaderComponent } from '../uploader/uploader.component';
import { DOCUMENT, ViewportScroller } from "@angular/common";
import { addDays, format } from 'date-fns/esm'
import { DefaultConfig } from '../models/defaultconfig';

@Component({
  selector: 'app-sharing',
  templateUrl: './sharing.component.html',
  styleUrls: ['./sharing.component.css']
})
export class SharingComponent implements OnInit {

  subscribed: boolean;
  retentionUpdated = false;
  passwordUpdated = false;
  sessionNameUpdated = false;
  expiryDate;
  showPassword: boolean;
  subscription: Subscription;
  copyClicked: boolean;
  copyClicked2: boolean;

  sessionLength: any[];
  sharingLink: string;
  passwordGenerated: string = this.createGuid();

  @Input() sessionType: SessionType = SessionType.Send;
  @ViewChild("upload") upload: UploaderComponent;
  @ViewChild("password") password: ElementRef;
  @ViewChild("passwordEnforced") passwordEnforced: ElementRef;
  @ViewChild("sessionName") sessionName: ElementRef;
  @ViewChild("retention") retention: MatSelect;

  constructor(
    public uploadService: UploadService,
    private scroller: ViewportScroller,
    @Inject(DOCUMENT) public document: Document, public defaultConfig: DefaultConfig
  ) { }

  ngOnInit() {

    if (this.defaultConfig.allowedRetentions) {
      const split = this.defaultConfig.allowedRetentions.split(",");

      if (split.length > 0) {
        this.sessionLength = [];
        split.forEach(retention => {
          this.sessionLength.push(
            { "value": Number.parseInt(retention, null), "viewValue": retention }
          );
        });
      }

      this.expiryDate = addDays(new Date(), Number(split[0]));
    } else {
      //default is 7 days if no default retention is specified
      this.expiryDate = addDays(new Date(), 7);
    }

    let part: string;
    if (this.sessionType === SessionType.Send) {
      part = "download";
    } else {
      part = "upload";
    }

    this.uploadService.createSession(this.sessionType, undefined).subscribe(() => {
      this.sharingLink = `${document.location.origin}/${part}/${this.uploadService.session.id}`;

      if (this.defaultConfig.enforcePassword) {
        this.uploadService.setPassword(this.passwordGenerated).subscribe();
      }
    });
  }

  public ngAfterViewInit() {

    if (this.passwordEnforced) {
      this.subscription = fromEvent(this.passwordEnforced.nativeElement, 'keyup').pipe(
        tap(() => {
          this.passwordUpdated = false;
        }),
        // get value
        map((event: any) => {
          return event.target.value;
        })
        // Time in milliseconds between key events
        , debounceTime(500)
        // If previous query is different from current
        , distinctUntilChanged()
        // subscription for response
      ).subscribe((password) => {
        this.uploadService.setPassword(password).subscribe(() => {
          this.passwordUpdated = true;
          this.passwordGenerated = password;
        });
      });
    }
  }

  public copyClick() {
    this.copyClicked = true;

    setTimeout(() => {
      this.copyClicked = false;
    }, 2500);
  }
  public copyClick2() {
    this.copyClicked2 = true;

    setTimeout(() => {
      this.copyClicked2 = false;
    }, 2500);
  }
  createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }



  openSettings() {

    // scroll a bit so that the settings are visible
    setTimeout(() => {
      this.scroller.scrollToAnchor('sessionname');
    }, 250);

    if (!this.subscribed) {
      fromEvent(this.sessionName.nativeElement, 'keyup').pipe(
        // reset the updated icon
        tap(() => {
          this.sessionNameUpdated = false;
        }),
        // get value
        map((event: any) => {
          return event.target.value;
        })
        // Time in milliseconds between key events
        , debounceTime(500)
        // If previous query is different from current
        , distinctUntilChanged()
        // subscription for response
      ).subscribe((sessionName) => {
        this.uploadService.setSessionName(sessionName).subscribe(() => {
          this.sessionNameUpdated = true;
        });
      });

      this.retention.selectionChange.pipe(
        tap(() => {
          this.retentionUpdated = false;
        }),
        // get value
        map((event: any) => {
          return event.value;
        })
        // Time in milliseconds between key events
        , debounceTime(500)
        // If previous query is different from current
        , distinctUntilChanged()
        // subscription for response
      ).subscribe((value) => {
        this.uploadService.setRetention(value).subscribe(() => {
          this.retentionUpdated = true;

          this.expiryDate = addDays(new Date(), value);
        });
      });

      this.subscribed = true;
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;

    if (!this.showPassword) {
      this.uploadService.setPassword("").subscribe();
      this.password.nativeElement.value = "";

      if (this.subscription) {
        this.subscription.unsubscribe();
      }

    } else {
      // set timeout is required otherwise the element is not there yet.
      setTimeout(() => {
        this.subscription = fromEvent(this.password.nativeElement, 'keyup').pipe(
          tap(() => {
            this.passwordUpdated = false;
          }),
          // get value
          map((event: any) => {
            return event.target.value;
          })
          // Time in milliseconds between key events
          , debounceTime(500)
          // If previous query is different from current
          , distinctUntilChanged()
          // subscription for response
        ).subscribe((password) => {
          this.uploadService.setPassword(password).subscribe(() => {
            this.passwordUpdated = true;

          });
        });

        this.password.nativeElement.focus();

      });
    }
  }

}
