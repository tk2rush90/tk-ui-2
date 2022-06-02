import {Component} from '@angular/core';
import {Modal} from '@tk-ui/components/modal/modal/modal.component';
import {OptionItem} from '@tk-ui/models/option-item';

@Component({
  selector: 'app-test-modal',
  templateUrl: './test-modal.component.html',
  styleUrls: ['./test-modal.component.scss']
})
export class TestModalComponent extends Modal {
  options: OptionItem<string>[] = [];

  constructor() {
    super();

    for (let i = 0; i < 100; i ++) {
      this.options.push(new OptionItem<string>(`Label ${i}`, `${i}`));
    }
  }
}
