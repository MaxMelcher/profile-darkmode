import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileIconDirective } from '../directives/fileicon.directive';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatBadgeModule } from '@angular/material/badge';
import { ClipboardModule } from 'ngx-clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxFilesizeModule } from 'ngx-filesize';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { DragDropDirective } from '../directives/drag-drop.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrModule } from 'ngx-toastr';
import { FormatDistanceToNowPipeModule, FormatPipeModule, ParsePipeModule } from 'ngx-date-fns';
import { UploaderComponent } from '../uploader/uploader.component';
import { SharingComponent } from '../sharing/sharing.component';


@NgModule({
  declarations: [
    FileIconDirective,
    DragDropDirective,
    UploaderComponent,
    SharingComponent
  ],
  imports: [
    CommonModule,
    MatBadgeModule,
    TranslateModule.forChild(),
    ClipboardModule,
    MatButtonModule,
    MatIconModule,
    NgxFilesizeModule,
    MatProgressBarModule,
    MatTableModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatSelectModule,
    MatExpansionModule,
    MatOptionModule,
    MatInputModule,
    MatTooltipModule,
    ToastrModule.forRoot(),

    FormatDistanceToNowPipeModule,
    FormatPipeModule,
    ParsePipeModule,
  ],
  exports: [
    DragDropDirective,
    FileIconDirective,
    HttpClientModule,
    MatBadgeModule,
    TranslateModule,
    ClipboardModule,
    MatButtonModule,
    MatIconModule,
    NgxFilesizeModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    ToastrModule,
    SharingComponent,
    UploaderComponent,
  ]
})
export class SharedModule {
  constructor() {
  }
}
