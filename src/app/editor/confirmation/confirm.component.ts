import { Component, Input } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements ModalComponent {
    @Input() metadata: any;
    @Input() close: any;

    public confirm() {
      this.metadata.confirm();
      this.close();
    }
}