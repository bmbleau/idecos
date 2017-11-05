import { Component, Input } from '@angular/core';
import { PluginComponent } from '../plugin/plugin.component';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { FileService } from '../file.service';
import { Store } from '@ngrx/store';
import { WindowService } from '../window.service';
import { EditorState } from './editor.state';
import * as md5 from 'md5';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements PluginComponent {
  @Input() metadata: any;
  public editor$ = this.store$.select('editor');
  private editor: EditorState;
  private editorSub: Subscription;
  
  constructor(
    public FileService: FileService,
    private window: WindowService,
    private store$: Store<EditorState>,
  ) { }
  
  public ngOnInit() {
    this.editorSub = this.editor$.subscribe((state: EditorState) => this.editor = state);
  }
  
  public ngOnDestroy() {
    [
      this.editorSub
    ].forEach(sub => {
      if (sub) sub.unsubscribe();
    })
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
  
  public getTabName(tab) {
    const fileName = tab.name.split('/').pop();
    const filePrefix = tab.md5 !== md5(tab.contents) ? '*' : '';
    return `${filePrefix}${fileName}`;
  }
  
  public updateTabContents(contents) {
    this.store$.dispatch({
      type: 'editor:tab:update',
      payload: contents,
    });
  }
  
  public saveTab(index: number = this.editor.selectedTab) {
    this.store$.dispatch({
      type: "editor:tab:save",
      payload: this.editor.tabs[index],
    });
  }
  
  public removeTab(index) {
    this.store$.dispatch({
      type: "editor:tab:remove",
      payload: index,
    });
  }
  
  public selectTab(index) {
    this.store$.dispatch({
      type: "editor:tab:select",
      payload: index,
    });
  }
  
  public createTabContextMenu(index, tab) {
    const contextMenu: any[] = [];
    
    if (index === this.editor.selectedTab) {
      contextMenu.push({
        label: 'Close Tab',
        onclick: this.removeTab.bind(this, index),
      });
    }
    
    if (tab.md5 !== md5(tab.contents)) {
      contextMenu.push({
        label: 'Save',
        onclick: this.saveTab.bind(this, index)
      });
    }
    
    if (this.editor.tabs.length > 1 && this.editor.selectedTab !== index) {
      contextMenu.push({
        label: 'Select Tab',
        onclick: this.selectTab.bind(this, index),
      });
    }
    
    return contextMenu;
  }
  
  get saveHandler() {
    return (() => {
      return this.saveTab.bind(this);
    }).call(this);
  }
  
  get directoryContextMenu() {
    const contextMenu = [];

    if (!!this.editor.directory) {
      contextMenu.push({
        label: "Close Project",
        onclick: this.closeProject.bind(this),
      });
    } else {
      contextMenu.push({
        label: "Open New Project",
        onclick: this.openProject.bind(this),
      });
    }
    
    return contextMenu;
  }
}
