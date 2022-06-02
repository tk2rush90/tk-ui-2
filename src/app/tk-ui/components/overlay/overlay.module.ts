import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayOutletComponent} from './overlay-outlet/overlay-outlet.component';
import {OverlayCoverComponent} from './overlay-cover/overlay-cover.component';
import {OverlayContent} from './overlay-content/overlay-content.directive';


@NgModule({
  declarations: [
    OverlayOutletComponent,
    OverlayCoverComponent,
    OverlayContent,
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
