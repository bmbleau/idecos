import { Component, Input } from '@angular/core';
import { PluginComponent } from '../plugin/plugin.component';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements PluginComponent {
  @Input() metadata: any;
}
