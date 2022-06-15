import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalOutletComponent} from './modal-outlet/modal-outlet.component';
import {ModalBackdropComponent} from './modal-backdrop/modal-backdrop.component';
import {Modal} from './modal/modal.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ModalContainerComponent} from './modal-container/modal-container.component';


@NgModule({
  declarations: [
    ModalOutletComponent,
    ModalBackdropComponent,
    Modal,
    ModalContainerComponent,
  ],
  exports: [
    ModalOutletComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
  ]
})
export class ModalModule { }
