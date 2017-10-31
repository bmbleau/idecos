import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { EditorState } from '../editor.state';
import * as md5 from 'md5';

@Component({
  selector: 'directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DirectoryComponent {
  @Input() entry;
  @Input() hidden: boolean = true;
  
  constructor(
    private store$: Store<EditorState>,
  ) { }
  
  get hasChanged() {
    if (this.entry.isFile) {
      return this.entry.md5 !== md5(this.entry.contents);
    }

    return false;
  }
  
  public action() {
    if (this.entry.isFile) {
      this.store$.dispatch({
        type: 'editor:tab:add',
        payload: this.entry,
      });
    } else {
      this.hidden = !this.hidden;
    }
  }
}
