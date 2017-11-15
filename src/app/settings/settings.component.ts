import { Component, Input } from '@angular/core';
import { PluginComponent } from '../plugin/plugin.component';
import { WindowService } from '../window.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements PluginComponent {
  @Input() metadata: any;

  constructor(
    private window: WindowService,
  ) {}

  get i18n() {
    return this.window.i18n;
  }
}
