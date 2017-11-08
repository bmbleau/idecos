import { Component, Input } from '@angular/core';
import { PluginComponent } from '../plugin/plugin.component';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements PluginComponent {
  @Input() metadata: any;
}
