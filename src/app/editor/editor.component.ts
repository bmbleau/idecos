import { Component, Input } from '@angular/core';
import { PluginComponent } from '../plugin/plugin.component';
import { BehaviorSubject } from 'rxjs/Rx';
import { FileService } from '../file.service';
import { Store } from '@ngrx/store';
import { EditorState } from './editor.state';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements PluginComponent {
  @Input() metadata: any;
  public editor$ = this.store$.select('editor');
  
  constructor(
    public FileService: FileService,
    private store$: Store<EditorState>,
  ) { }
  
  public fileName(entry) {
    return entry.name.split('/').pop();
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
