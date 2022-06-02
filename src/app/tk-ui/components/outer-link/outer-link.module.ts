import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OuterLinkDirective} from './outer-link.directive';


@NgModule({
  declarations: [
    OuterLinkDirective
  ],
  exports: [
    OuterLinkDirective
  ],
  imports: [
    CommonModule
  ]
})
export class OuterLinkModule { }
