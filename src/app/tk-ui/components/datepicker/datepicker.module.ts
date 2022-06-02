import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatepickerComponent} from './datepicker.component';
import {InputModule} from '@tk-ui/components/input/input.module';
import {IconModule} from '@tk-ui/components/icon/icon.module';
import {FormsModule} from '@angular/forms';
import {DatepickerCalendarComponent} from './datepicker-calendar/datepicker-calendar.component';
import {OverlayModule} from '@tk-ui/components/overlay/overlay.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RippleModule} from '@tk-ui/components/ripple/ripple.module';
import {FlatButtonModule} from '@tk-ui/components/flat-button/flat-button.module';
import {IsSameDatePipeModule} from '@tk-ui/pipes/is-smae-date-pipe/is-same-date-pipe.module';


@NgModule({
  declarations: [
    DatepickerComponent,
    DatepickerCalendarComponent
  ],
  exports: [
    DatepickerComponent
  ],
  imports: [
    CommonModule,
    InputModule,
    IconModule,
    FormsModule,
    OverlayModule,
    BrowserAnimationsModule,
    RippleModule,
    FlatButtonModule,
    IsSameDatePipeModule,
  ],
})
export class DatepickerModule { }
