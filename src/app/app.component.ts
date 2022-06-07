import {AfterViewInit, Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {OptionItem} from '@tk-ui/models/option-item';
import {StringUtil} from '@tk-ui/utils/string.util';
import {ModalService} from '@tk-ui/components/modal/modal.service';
import {TestModalComponent} from './components/test-modal/test-modal.component';
import {LoggerUtil} from '@tk-ui/utils/logger.util';
import {MessageService} from '@tk-ui/components/message/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'tk-ui-2';

  control = new FormControl<string>('50');

  range = 0;

  checked = false;

  options: OptionItem<string>[] = [];

  values: string[] = [];

  filteredOptions: OptionItem<string>[] = [];

  timer: any;

  pending = false;

  constructor(
    private modalService: ModalService,
    private messageService: MessageService,
  ) {
    for (let i = 0; i < 10; i++) {
      this.options.push(new OptionItem<string>(`Value ${i + 1}`, `${i + 1}`));
    }

    this.filteredOptions = this.options;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.control.valueChanges
        .subscribe(value => console.log(value));

    });
  }

  openInfo(): void {
    this.messageService.info('Info');
  }

  openError(): void {
    this.messageService.error('Error');
  }

  openSuccess(): void {
    this.messageService.success('Success');
  }

  clickOpenModal(): void {
    this.openModal();
    this.openModal();
    this.openModal();
    this.openModal();
    this.openModal();
  }

  openModal(): void {
    const logger = LoggerUtil.createLogger(this);

    this.modalService.open({
      component: TestModalComponent,
      onClose: () => {
        logger.warn('Modal closed');
      },
    });

    LoggerUtil.info('Modal opened');
  }

  onSearchChange(search: string): void {
    clearTimeout(this.timer);

    this.pending = true;

    this.timer = setTimeout(() => {
      this.filteredOptions = this.options.filter(option => StringUtil.contains(option.label, search));
      this.pending = false;
    }, 300);
  }

  dateMask(value: string): string {
    // Remove all not numeric characters.
    value = value.replace(/\D/gmi, '');

    const year = value.slice(0, 4);
    const month = value.slice(4, 6);
    const date = value.slice(6, 8);

    return [year, month, date].filter(_value => _value).join('-');
  }
}
