import { Injectable } from '@angular/core';
import { SettingsState } from './settings.state';
import { EDITOR_SETTINGS_DEBUG } from './settings.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class SettingsService {
    public settings$ = this.store$.select('settings');

    constructor(
        private store$: Store<SettingsState>,
    ) { }

    public disableEvent(event) {
        return this.settings.debug;
    }

    get settings() {
        let settings = null;
        if (this.settings$) this.settings$.take(1).subscribe(_settings => settings = _settings);
        return settings;
    }
}