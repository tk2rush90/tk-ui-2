import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ArrowModule} from '@tk-ui/components/arrow/arrow.module';
import {InputModule} from '@tk-ui/components/input/input.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RangeSliderModule} from '@tk-ui/components/range-slider/range-slider.module';
import {CheckboxModule} from '@tk-ui/components/checkbox/checkbox.module';
import {SelectModule} from '@tk-ui/components/select/select.module';
import {OverlayModule} from '@tk-ui/components/overlay/overlay.module';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {MultiSelectModule} from '@tk-ui/components/multi-select/multi-select.module';
import {SearchSelectModule} from '@tk-ui/components/search-select/search-select.module';
import {FlatButtonModule} from '@tk-ui/components/flat-button/flat-button.module';
import {InlineButtonModule} from '@tk-ui/components/inline-button/inline-button.module';
import {StrokeButtonModule} from '@tk-ui/components/stroke-button/stroke-button.module';
import {DatepickerModule} from '@tk-ui/components/datepicker/datepicker.module';
import {RadioGroupModule} from '@tk-ui/components/radio-group/radio-group.module';
import {TestModalComponent} from './components/test-modal/test-modal.component';
import {ModalModule} from '@tk-ui/components/modal/modal.module';
import {TestModuleModule} from './components/test-module/test-module.module';
import {MessageModule} from '@tk-ui/components/message/message.module';
import {RouterProgressModule} from '@tk-ui/components/router-progress/router-progress.module';
import {TestPageComponent} from './pages/test-page/test-page.component';
import {TestNextPageComponent} from './pages/test-next-page/test-next-page.component';
import {SpinnerModule} from '@tk-ui/components/spinner/spinner.module';

@NgModule({
  declarations: [
    AppComponent,
    TestModalComponent,
    TestPageComponent,
    TestNextPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ArrowModule,
    InputModule,
    FormsModule,
    ReactiveFormsModule,
    RangeSliderModule,
    CheckboxModule,
    SelectModule,
    OverlayModule,
    MultiSelectModule,
    SearchSelectModule,
    FlatButtonModule,
    InlineButtonModule,
    StrokeButtonModule,
    DatepickerModule,
    RadioGroupModule,
    ModalModule,
    TestModuleModule,
    MessageModule,
    RouterProgressModule,
    SpinnerModule,
  ],
  providers: [
    SubscriptionService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
