import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UploadComponent } from './upload.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { DragDropDirective } from '../directives/drag-drop.directive';

const routes: Routes = [
  { path: '', component: UploadComponent }
];

@NgModule({
  declarations: [UploadComponent],
  imports: [
    SharedModule,
    TranslateModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatProgressBarModule,
    MatInputModule,
    MatTableModule,
    MatSlideToggleModule,
    MatSelectModule
  ]
})
export class UploadModule { }
