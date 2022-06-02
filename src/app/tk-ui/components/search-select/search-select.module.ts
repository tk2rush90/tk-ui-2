import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchSelectComponent} from './search-select.component';
import {SearchSelectOptionsComponent} from './search-select-options/search-select-options.component';
import {FormsModule} from '@angular/forms';
import {InputModule} from '@tk-ui/components/input/input.module';
import {IconModule} from '@tk-ui/components/icon/icon.module';
import {OverlayModule} from '@tk-ui/components/overlay/overlay.module';


@NgModule({
  declarations: [
    SearchSelectComponent,
    SearchSelectOptionsComponent
  ],
  exports: [
    SearchSelectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InputModule,
    IconModule,
    OverlayModule,
  ]
})
export class SearchSelectModule { }
