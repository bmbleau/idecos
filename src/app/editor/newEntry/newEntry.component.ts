import {
  Component,
  ElementRef,
  Input,
} from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'new-entry',
  templateUrl: './newEntry.component.html',
  styleUrls: ['./newEntry.component.css']
})
export class NewEntryComponent implements ModalComponent {
  @Input('metadata') metadata;
  @Input() value;

  constructor(
    private _element: ElementRef,
  ){ }
  
  public ngAfterViewInit() {
    this.focus();
  }
  
  public focus() {
    const input = this.element.firstChild;
    input.focus();
    const value = '';
    input.value = `${this.value || this.metadata.value}/`;
  }
  
  get element() {
    return this._element.nativeElement;
  }
}