import { ActionReducer, Action } from '@ngrx/store';
import { SettingsState } from './settings.state';

export const EDITOR_SETTINGS_DEBUG = 'EDITOR:SETTINGS:DEBUG';
export const EDITOR_SETTINGS_AUTO_SAVE = 'EDITOR:SETTINGS:AUTO_SAVE';
export const EDITOR_SETTINGS_OPEN_ALL = 'EDITOR:SETTINGS:OPEN_ALL';

export function settingsReducer(state: SettingsState = new SettingsState(), action: Action) {

    if (state.debug) console.log(action);

    switch (action.type) {
        case EDITOR_SETTINGS_DEBUG: {
            return Object.assign(new SettingsState(), state, {
                debug: !state.debug,
            });
        }
        case EDITOR_SETTINGS_AUTO_SAVE: {
            return Object.assign(new SettingsState(), state, {
                autoSaveInterval: Math.abs(action.payload),
            });
        }
        case EDITOR_SETTINGS_OPEN_ALL: {
            return Object.assign(new SettingsState(), state, {
                openAll: !state.openAll,
            });
        }
        default: {
          return state;
        }
    }
}