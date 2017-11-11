import {
  Component,
  ElementRef,
  Input,
} from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { Store } from '@ngrx/store';

@Component({
  selector: 'new-entry',
  templateUrl: './newEntry.component.html',
  styleUrls: ['./newEntry.component.css']
})
export class NewEntryComponent implements ModalComponent {
  @Input('metadata') metadata;
  @Input('close') close;

  @Input('value') set value(value) {
    this.metadata.value = value;
  };

  @Input('type') set type(type: 'folder' | 'file') {
    this.metadata.type = type;
  };

  constructor(
    private store$: Store<any>,
    private _element: ElementRef,
  ){ }
  
  public ngAfterViewInit() {
    this.focus();
    this.element.addEventListener('keypress', this.keyHandler.bind(this));
  }
  
  private keyHandler(event) {
    switch(event.key) {
      case 'Enter': {
        console.log(this.inputValue, this);
        this.store$.dispatch({
          type: 'editor:file:create',
          payload: {
            directory: this.metadata.root,
            name: this.inputValue,
          }
        });
        this.close();
        // Dispatch event to create the file or folder.
        // close the modal is it is no longer needed.
      }
    }
  }
  
  public focus() {
    this.element.firstChild.focus();
    this.inputValue = '';
    this.inputValue = `${this.metadata.value}/`;
  }
  
  set inputValue(value) {
    this.element.firstChild.value = value;
  }
  
  get inputValue() {
    return this.element.firstChild.value;
  }
  
  get element() {
    return this._element.nativeElement;
  }
}