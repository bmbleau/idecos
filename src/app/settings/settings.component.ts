import { Component, Input } from '@angular/core';
import { PluginComponent } from '../plugin/plugin.component';
import { WindowService } from '../window.service';
import { Store } from '@ngrx/store';
import { EDITOR_SETTINGS_DEBUG } from './settings.reducer';
import { SettingsState } from './settings.state';

export type tSettingsState = 'settings' | 'change log' | 'about' | 'plugins';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements PluginComponent {
  public settings$ = this.store$.select('settings');
  public settingsPage: tSettingsState = 'settings';
  @Input() metadata: any;

  constructor(
    private store$: Store<SettingsState>,
    private window: WindowService,
  ) { }

  get i18n() {
    return this.window.i18n;
  }

  public toggleDebugger() {
    this.store$.dispatch({
      type: EDITOR_SETTINGS_DEBUG,
    });
  }
  
  public goToPage(pageName: tSettingsState) {
    this.settingsPage = pageName;
  }

  get settings() {
    let settings = null;
    if (this.settings$) this.settings$.take(1).subscribe(_settings => settings = _settings);
    return settings;
  }
}
