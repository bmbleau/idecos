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
  
  public createContextMenu() {
    const contextMenu = [];
    
    if (!this.entry.isFile) {
      contextMenu.push({ label: 'Toggle Folder', onclick: this.action.bind(this) });
      contextMenu.push({ hr: true });
      contextMenu.push({ label: 'Rename Directory' });
      contextMenu.push({ hr: true });
      contextMenu.push({ label: 'Move Folder' });
      contextMenu.push({ label: 'New Folder' });
      contextMenu.push({ label: 'New File' });
    } else {
      contextMenu.push({ label: 'Open File', onclick: this.action.bind(this) });
      contextMenu.push({ hr: true });
      contextMenu.push({ label: 'Remove File' });
      contextMenu.push({ hr: true });
      contextMenu.push({ label: 'Move File' });
      contextMenu.push({ label: 'Rename File' });
    }
    
    return contextMenu;
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
