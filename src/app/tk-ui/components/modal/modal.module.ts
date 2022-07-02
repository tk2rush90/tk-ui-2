import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalBackdropComponent} from './modal-backdrop/modal-backdrop.component';
import {Modal} from './modal/modal.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ModalContainerComponent} from './modal-container/modal-container.component';


@NgModule({
  declarations: [
    ModalBackdropComponent,
    Modal,
    ModalContainerComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
  ]
})
export class ModalModule { }
