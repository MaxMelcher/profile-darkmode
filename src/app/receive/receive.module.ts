import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReceiveComponent } from './receive.component';

import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { DateFnsModule, FormatDistanceToNowPipeModule, FormatPipeModule, ParsePipeModule } from 'ngx-date-fns';

const routes: Routes = [
  { path: '', component: ReceiveComponent }
];

@NgModule({
  declarations: [ReceiveComponent],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatInputModule,
  ],
})
export class ReceiveModule { }
