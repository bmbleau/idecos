import { Component, Input } from '@angular/core';
import { PluginComponent } from '../plugin/plugin.component';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements PluginComponent {
  @Input() metadata: any;
}
