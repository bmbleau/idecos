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
  @Input() root: boolean = false;
  
  private newFileModalId: number;
  private newFolderModalId: number;

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
  
  get hasChanged() {
    if (this.entry.isFile) {
      return this.entry.md5 !== md5(this.entry.contents);
    }

    return false;
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
      if (!this.root) {
        contextMenu.push({ label: 'Remove Folder' });
        // contextMenu.push({ hr: true });
        // contextMenu.push({ label: 'Move Folder' });
        // contextMenu.push({ label: 'Rename Folder' });
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
      contextMenu.push({ label: 'Remove File' });
      // contextMenu.push({ hr: true });
      // contextMenu.push({ label: 'Move File' });
      // contextMenu.push({ label: 'Rename File' });
    }
    
    return contextMenu;
  }
  
  public newFileHandler() {
    this.ModalService.activateModal(this.newFileModalId);
  }
  
  public newFolderHandler() {
    this.ModalService.activateModal(this.newFolderModalId);
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
