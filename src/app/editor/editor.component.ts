import { Component, Input } from '@angular/core';
import { PluginComponent } from '../plugin/plugin.component';
import { BehaviorSubject } from 'rxjs/Rx';
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
  public tabTitles: string[] = [];
  private editor: EditorState;
  private editorSub;
  
  public directoryContextMenu = [
  	{
  		label: "Close Project",
  		onclick: this.closeProject.bind(this),
  	}
  ];
  
  constructor(
    public FileService: FileService,
    private window: WindowService,
    private store$: Store<EditorState>,
  ) { }
  
  ngOnInit() {
    this.editorSub = this.editor$.subscribe((state: EditorState) => this.editor = state);
  }
  
  get saveHandler() {
    return (() => {
      return this.saveTab.bind(this);
    }).call(this);
  }
  
  ngOnDestroy() {
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
  
  public saveTab() {
    this.store$.dispatch({
      type: "editor:tab:save",
      payload: this.editor.tabs[this.editor.selectedTab],
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
}
