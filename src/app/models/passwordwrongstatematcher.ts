import { NgForm, FormGroupDirective } from '@angular/forms';
import { UntypedFormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class PasswordWrongStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
