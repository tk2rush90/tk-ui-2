import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RippleDirective} from './ripple.directive';
import {RippleComponent} from './ripple.component';


@NgModule({
  declarations: [
    RippleDirective,
    RippleComponent
  ],
  exports: [
    RippleDirective
  ],
  imports: [
    CommonModule
  ]
})
export class RippleModule {
}
