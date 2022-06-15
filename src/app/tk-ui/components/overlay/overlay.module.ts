import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayOutletComponent} from './overlay-outlet/overlay-outlet.component';
import {OverlayContent} from './overlay-content/overlay-content.directive';
import {OverlayBackdropComponent} from './overlay-backdrop/overlay-backdrop.component';


@NgModule({
  declarations: [
    OverlayOutletComponent,
    OverlayContent,
    OverlayBackdropComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    OverlayOutletComponent
  ]
})
export class OverlayModule {
}
