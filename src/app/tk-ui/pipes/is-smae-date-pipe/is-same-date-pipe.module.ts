import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IsSameDatePipe} from './is-same-date.pipe';


@NgModule({
  declarations: [
    IsSameDatePipe
  ],
  exports: [
    IsSameDatePipe
  ],
  imports: [
    CommonModule
  ]
})
export class IsSameDatePipeModule { }
