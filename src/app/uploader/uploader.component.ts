import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Upload } from '../models/upload';
import { UploadService, SessionType } from '../services/upload.service';
import { Title } from '@angular/platform-browser';
import { Subject, Observable, from } from 'rxjs';
import { filter, tap, map, concatMap, mergeMap } from 'rxjs/operators';
import { Session } from '../models/session';
import { TranslateService } from '@ngx-translate/core';
import { DefaultConfig } from '../models/defaultconfig';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

  @ViewChild("table") table: MatTable<Upload>;
  @Input() sessionType: SessionType = SessionType.Send;
  allowedExtensions: string[];
  startTime: number;

  constructor(
    public uploadService: UploadService,
    private titleService: Title,
    private translate: TranslateService,
    public defaultConfig: DefaultConfig,
    private scroller: ViewportScroller
  ) {

  }

  public mapUploads: Map<string, Upload> = new Map<string, Upload>();
  public uploads: Upload[] = [];
  public datasource: MatTableDataSource<Upload> = new MatTableDataSource(this.uploads);

  displayedColumns: string[] = ["file", "progress"];

  support: boolean;

  onUpload = new Subject<Upload>();
  OnAllUploadComplete = new Subject<boolean>();
  getSession: Observable<Session>;
  uploaded = false;

  inProgress = 0;

  ngOnInit() {
    this.support = (
      (typeof (File) !== "undefined")
      &&
      (typeof (Blob) !== "undefined")
      &&
      (typeof (FileList) !== "undefined")
      &&
      (!!Blob.prototype.slice || false)
    );

    this.allowedExtensions = this.defaultConfig.allowedFileExtensions.split(",").map(x => x.trim());

    // subscribe to file uploads
    const uploads = from(this.onUpload);
    const filtered = uploads.pipe(
      map((u: Upload) => {

        let ext = u.file.name.split('.').pop();
        ext = ext.toLowerCase().trim();

        // this.defaultConfig.allowedFileExtensions is empty if all extensions are allowed
        // otherwise check if the extension is in the list
        if (this.defaultConfig.allowedFileExtensions && this.allowedExtensions.indexOf(ext) === -1) {
          u.extensionAllowed = false;
        } else {
          u.extensionAllowed = true;
        }

        // file does not have an extension
        if (u.file.name.indexOf(".") === -1) {
          u.extensionAllowed = true;
        }
        if (this.defaultConfig.allowedFileSize === 0 || u.file.size < this.defaultConfig.allowedFileSize) {

          u.fileSizeAllowed = true;
        }
        if (u.file.size === 0) {
          u.fileZeroBytes = true;
        }

        return u;
      })
    );

    // upload the files that have allowed extensions and sizes
    filtered.pipe(
      tap(x => {
        if (!this.startTime) {
          this.startTime = Date.now();
        }
      }),
      filter(u => {
        return u.extensionAllowed && u.fileSizeAllowed && !u.fileZeroBytes;
      }
      ),
      concatMap((upload) => this.uploadService.createSession(this.sessionType, upload)),
      mergeMap(sessionUpload => this.uploadService.handleUpload(sessionUpload), 3))
      .subscribe(() => {

        //file is uploaded
        this.inProgress--;

        if (this.inProgress <= 0) {
          this.titleService.setTitle(
            `${this.translate.instant("upload.title.uploadComplete")} :: ${this.translate.instant("home.product")}`
          );
          this.OnAllUploadComplete.next(true);
        } else {
          this.titleService.setTitle(`${this.translate.instant("upload.title.uploading", { items: this.inProgress })} :: ${this.translate.instant("home.product")}`);
        }
      });

    // handle the not allowed files
    filtered.pipe(
      filter(u => !u.extensionAllowed || !u.fileSizeAllowed)).subscribe((u) => {
        this.inProgress--;
        if (this.inProgress <= 0 && u.transferred > 0) {
          this.titleService.setTitle(
            `${this.translate.instant("upload.title.uploadComplete")} :: ${this.translate.instant("home.product")}`
          );
          this.OnAllUploadComplete.next(true);
        } else {
          this.titleService.setTitle(`${this.translate.instant("upload.title.uploading", { items: this.inProgress })} :: ${this.translate.instant("home.product")}`);
        }
      });

    // subscribe to file uploads
    from(this.onUpload)
      .subscribe((upload) => {

        this.inProgress++;

        setTimeout(() => {
          this.scroller.scrollToAnchor('progress');
        }, 250);

        if (upload.fileSizeAllowed && upload.extensionAllowed) {
          this.uploaded = true;
        }

        this.uploads.push(upload);
        this.datasource.data = this.uploads;
      });
  }

  onFilesAdded(files) {
    for (let i = 0; i < files.length; i++) {

      if (!files[i].fullPath) {
        files[i].fullPath = `/${files[i].name}`;
      }

      const name = files[i].fullPath;

      // do not add the same element twice
      if (!this.mapUploads.has(name)) {
        const upload = {
          file: files[i], progress: 0, buffer: 0, started: false, transferred: 0, extensionAllowed: false, fileSizeAllowed: false, virus: "", fileZeroBytes: false
        };

        setTimeout(() => {
          this.onUpload.next(upload);
          this.mapUploads.set(name, upload);
        }, 50);
      }
    }
  }
}
