import { Component, Input } from '@angular/core';
import { PluginComponent } from '../plugin/plugin.component';

@Component({
  selector: 'tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.css']
})
export class TipsComponent implements PluginComponent {
  @Input() metadata: any;
}
