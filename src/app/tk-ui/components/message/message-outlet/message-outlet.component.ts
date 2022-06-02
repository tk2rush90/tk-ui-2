import {AfterViewInit, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {MessageService} from '@tk-ui/components/message/message.service';

/**
 * The outlet to create a message in it.
 */
@Component({
  selector: 'app-message-outlet',
  templateUrl: './message-outlet.component.html',
  styleUrls: ['./message-outlet.component.scss']
})
export class MessageOutletComponent implements AfterViewInit {
  /**
   * `ViewContainerRef` to render messages.
   */
  @ViewChild('container', {read: ViewContainerRef}) viewContainerRef!: ViewContainerRef;

  /**
   * Set random id.
   */
  id = RandomUtil.key();

  constructor(
    private messageService: MessageService,
  ) {
  }

  ngAfterViewInit(): void {
    this.messageService.registerOutlet(this);
  }
}
