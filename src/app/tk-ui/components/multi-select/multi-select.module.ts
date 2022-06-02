import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MultiSelectComponent} from './multi-select.component';
import {IconModule} from '@tk-ui/components/icon/icon.module';
import {OverlayModule} from '@tk-ui/components/overlay/overlay.module';
import {InputModule} from '@tk-ui/components/input/input.module';
import {FormsModule} from '@angular/forms';
import {
  MultiSelectOptionsComponent
} from '@tk-ui/components/multi-select/multi-select-options/multi-select-options.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    MultiSelectComponent,
    MultiSelectOptionsComponent,
  ],
  exports: [
    MultiSelectComponent
  ],
  imports: [
    CommonModule,
    IconModule,
    OverlayModule,
    InputModule,
    FormsModule,
    BrowserAnimationsModule,
  ]
})
export class MultiSelectModule { }
