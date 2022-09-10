import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { retryBackoff } from 'backoff-rxjs';
import { catchError, map, tap, flatMap, mergeMap } from 'rxjs/operators';
import { Session } from '../models/session';
import { FileCreationStatusResponse } from '../models/filecreationstatusresponse';
import { Upload } from '../models/upload';
import { FileEntity } from '../models/fileentity';
import { EmailConfig } from '../models/emailconfig';
import { AuthConfig } from '../models/authconfig';
import { DefaultConfig } from '../models/defaultconfig';
import { SessionPerMonth } from '../models/sessionpermonth';
import { SessionTableResult } from '../models/sessiontableresult';
import { DragDropDirective } from '../directives/drag-drop.directive';

const url = '/api/file/';

export enum SessionType {
  Send = 2,
  Receive = 4
}

@Injectable()
export class UploadService {

  chunksize = (1024 * 1024 * 20);
  public session: Session;
  constructor(private http: HttpClient) { }

  // create a session on the backend if there does not exist one
  public createSession(type: SessionType, upload: Upload): Observable<Upload> {
    return of(upload);
  }



  public getSessionsForTable(order: string, sort: string, page: number, pagesize: number, search: string, password: string, year: number) {
    const s = encodeURIComponent(search);
    const p = encodeURIComponent(password);
    return this.http.get<SessionTableResult>(url +
      `session/table?order=${order}&sort=${sort}&page=${page}&pagesize=${pagesize}&search=${s}&password=${p}&year=${year}`);
  }

  public getUserSessionsForTable(order: string, sort: string, page: number, pagesize: number, search: string) {
    const s = encodeURIComponent(search);
    return this.http.get<SessionTableResult>(url +
      `session/my?order=${order}&sort=${sort}&page=${page}&pagesize=${pagesize}&search=${s}`);
  }

  public getSessionsPerMonth(year: string, password: string) {
    const p = encodeURIComponent(password);
    return this.http.get<SessionPerMonth>(url + `sessionspermonth?year=${year}&password=${p}`);
  }

  public getStoragePerMonth(year: string, password: string) {
    const p = encodeURIComponent(password);
    return this.http.get<SessionPerMonth>(url + `storagepermonth?year=${year}&password=${p}`);
  }

  public getVolumePerMonth(year: string, password: string) {
    const p = encodeURIComponent(password);
    return this.http.get<SessionPerMonth>(url + `volumepermonth?year=${year}&password=${p}`);
  }

  public getYearsForSessions(password: string) {
    const p = encodeURIComponent(password);
    return this.http.get<string[]>(url + `yearsforsession?password=${p}`);
  }

  public getSession(sessionId: string) {
    return this.http.get<Session>(url + `getsession/${sessionId}`);
  }

  saveDefaultConfig(defaultconfig: DefaultConfig) {
    return this.http.post(url + `saveDefaultConfig`, defaultconfig);
  }

  getDefaultConfig() {
    return this.http.get<DefaultConfig>(url + `defaultconfig`);
  }

  getAuthConfig() {
    return this.http.get<AuthConfig>(url + `authconfig`);
  }

  saveAuthConfig(authconfig: AuthConfig) {
    return this.http.post(url + `saveauthconfig`, authconfig);
  }

  login(authconfig: AuthConfig) {
    return this.http.post(url + `login`, authconfig);
  }

  getEmailConfig(password: string) {
    const p = encodeURIComponent(password);
    return this.http.get<EmailConfig>(url + `emailconfig?password=${p}`);
  }

  saveEmailConfig(emailConfig: EmailConfig) {
    return this.http.post(url + `saveEmailConfig`, emailConfig);
  }

  testEmail(emailConfig: EmailConfig) {
    return this.http.post<EmailConfig>(url + `testEmail`, emailConfig);
  }

  public delete(sessionId: string) {
    return this.http.get<Session>(url + `deletesession?sessionId=${sessionId}`);
  }

  public setPassword(password: string) {
    this.session.password = password;
    return this.http.post<Session>(url + `session/${this.session.id}/update`, this.session);
  }

  public setRetention(retention: number) {
    this.session.retention = retention;
    return this.http.post<Session>(url + `session/${this.session.id}/update`, this.session);
  }

  public setSessionName(name: string) {
    this.session.name = name;
    return this.http.post<Session>(url + `session/${this.session.id}/update`, this.session);
  }

  public getFiles(sessionId: string) {
    return this.http.get<FileEntity[]>(url + `files/${sessionId}`);
  }

  public getAudit(password: string) {
    const p = encodeURIComponent(password);
    return this.http.get(url + `audit?password=${p}`,
      { responseType: 'blob' }
    );
  }

  public getFilesWithPassword(sessionId: string, password: string) {
    return this.http.post<FileEntity[]>(url + `filesWithPassword/${sessionId}`, { password: password });
  }


  public handleUpload(upload: Upload) {
    return of(upload);
  }

  public createFile(upload: Upload, chunks: number) {
    // register a file in the backend
    return this.http.post<FileCreationStatusResponse>(url + `session/${this.session.id}/file/create`,
      { Chunks: chunks, FileSize: upload.file.size, FileName: upload.file.name, FullPath: upload.file.fullPath })
      .pipe(retryBackoff({ initialInterval: 1000, maxInterval: 60000 }));

  }

  public async upload(upload: Upload, chunks: number, fileCreation: FileCreationStatusResponse) {
  }
}
