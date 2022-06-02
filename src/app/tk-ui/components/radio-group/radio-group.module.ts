import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RadioGroupComponent} from './radio-group.component';
import {RadioComponent} from './radio/radio.component';
import {RippleModule} from '@tk-ui/components/ripple/ripple.module';


@NgModule({
  declarations: [
    RadioGroupComponent,
    RadioComponent
  ],
  exports: [
    RadioGroupComponent,
    RadioComponent
  ],
  imports: [
    CommonModule,
    RippleModule
  ]
})
export class RadioGroupModule { }
