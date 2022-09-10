import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, pipe } from 'rxjs';
import { DefaultConfig } from '../models/defaultconfig';

@Injectable()
export class TranslationService implements TranslateLoader {

    constructor(private http: HttpClient, private defaultConfig: DefaultConfig) { }

    getTranslation(lang: string): Observable<any> {

        if (this.defaultConfig.languageFolder) {
            //removing trailing slash
            var url = this.defaultConfig.languageFolder.replace(/\/$/, "");
            
            return this.http.get(`${url}/${lang}.json`);
        }
        else {
            return this.http.get(`/assets/i18n/${lang}.json`);
        }
    }
}