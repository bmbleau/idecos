import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { EditorState } from '../editor.state';
import * as md5 from 'md5';
import { NewEntryComponent } from '../newEntry/newEntry.component';
import { ModalService } from '../modal/modal.service';

@Component({
  selector: 'directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DirectoryComponent {
  @Input() entry;
  @Input() hidden: boolean = true;
  @Input() root;
  
  private newFileModalId: number;
  private newFolderModalId: number;
  private removeEntryModalId: number;

  constructor(
    private ModalService: ModalService,
    private store$: Store<EditorState>,
  ) { }
  
  public ngOnInit() {
    if (this.entry && this.entry.fullPath) {
      const modalShell = { root: this.entry, value: this.entry.fullPath, component: NewEntryComponent };
      this.newFileModalId = this.ModalService.register(Object.assign({ type: 'file' }, modalShell));
      this.newFolderModalId = this.ModalService.register(Object.assign({ type: 'folder' }, modalShell));
    }
  }
  
  public openDirectory(entry) {
    this.store$.dispatch({
      type: 'editor:open:directory',
      payload: entry,
    });
  }
  
  public closeProject() {
    this.store$.dispatch({
      type: 'editor:project:close'
    });
  }
  
  public openProject() {
    this.store$.dispatch({
      type: 'editor:project:new',
    });
  }
  
  public createContextMenu() {
    const contextMenu = [];
    
    if (!this.entry.isFile) {
      contextMenu.push({ label: 'Toggle Folder', onclick: this.action.bind(this) });
      contextMenu.push({ hr: true });
      if (this.root !== this.entry) {
        contextMenu.push({ label: 'Remove Folder', onclick: this.removeEntryHandler.bind(this) });
        contextMenu.push({ hr: true });
      } else {
        contextMenu.push({ label: 'Close Project', onclick: this.closeProject.bind(this) });
        contextMenu.push({ label: 'Open New Project', onclick: this.openProject.bind(this) });
        contextMenu.push({ hr: true });
      }
      contextMenu.push({ label: 'New Folder', onclick: this.newFolderHandler.bind(this) });
      contextMenu.push({ label: 'New File', onclick: this.newFileHandler.bind(this) });
    } else {
      contextMenu.push({ label: 'Open File', onclick: this.action.bind(this) });
      contextMenu.push({ hr: true });
      contextMenu.push({ label: 'Remove File', onclick: this.removeEntryHandler.bind(this) });
    }
    
    return contextMenu;
  }
  
  public newFileHandler() {
    this.ModalService.activateModal(this.newFileModalId);
  }
  
  public newFolderHandler() {
    this.ModalService.activateModal(this.newFolderModalId);
  }
  
  public removeEntryHandler() {
    this.store$.dispatch({
      type: 'editor:file:remove',
      payload: {
        root: this.root,
        entry: this.entry,
      },
    });
  }
  
  public action() {
    if (this.entry.isFile) {
      this.store$.dispatch({
        type: 'editor:tab:add',
        payload: this.entry,
      });
    } else {
      this.hidden = !this.hidden;
      if (!this.hidden) {
        this.openDirectory(this.entry);
      }
    }
  }
}
