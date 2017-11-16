import { ActionReducer, Action } from '@ngrx/store';
import { SettingsState } from './settings.state';

export const EDITOR_SETTINGS_DEBUG = 'EDITOR:SETTINGS:DEBUG';

export function settingsReducer(state: SettingsState = new SettingsState(), action: Action) {

    if (state.debug) console.log(action);

    switch (action.type) {
        case EDITOR_SETTINGS_DEBUG: {
            return Object.assign(new SettingsState(), {
                debug: !state.debug
            });
        }
        default: {
          return state;
        }
    }
}