import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectComponent} from './select.component';
import {InputModule} from '@tk-ui/components/input/input.module';
import {IconModule} from '@tk-ui/components/icon/icon.module';
import {FormsModule} from '@angular/forms';
import {OverlayModule} from '@tk-ui/components/overlay/overlay.module';
import {SelectOptionsComponent} from './select-options/select-options.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    SelectComponent,
    SelectOptionsComponent
  ],
  exports: [
    SelectComponent
  ],
  imports: [
    CommonModule,
    InputModule,
    IconModule,
    FormsModule,
    OverlayModule,
    BrowserAnimationsModule,
  ],
})
export class SelectModule { }
