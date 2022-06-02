import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessageOutletComponent} from './message-outlet/message-outlet.component';
import {MessageComponent} from './message/message.component';


@NgModule({
  declarations: [
    MessageOutletComponent,
    MessageComponent
  ],
  exports: [
    MessageOutletComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MessageModule { }
