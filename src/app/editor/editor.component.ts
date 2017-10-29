import { Component, Input } from '@angular/core';
import { PluginComponent } from '../plugin/plugin.component';
import { BehaviorSubject } from 'rxjs/Rx';
import { FileService } from '../file.service';
import { Store } from '@ngrx/store';
import { EditorState } from './editor.state';

type entry = {
  name: string;
  isFile: boolean;
  isDirectory: boolean;
  contents?: entry[];
};

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements PluginComponent {
  @Input() metadata: any;
  public editor$ = this.store$.select('editor');
  public projectPromises;
  
  constructor(
    public FileService: FileService,
    private store$: Store<EditorState>,
  ) { }
}
