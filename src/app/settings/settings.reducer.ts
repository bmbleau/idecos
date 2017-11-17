import { ActionReducer, Action } from '@ngrx/store';
import { SettingsState } from './settings.state';

export const EDITOR_SETTINGS_DEBUG = 'EDITOR:SETTINGS:DEBUG';
export const EDITOR_SETTINGS_AUTO_SAVE = 'EDITOR:SETTINGS:AUTO_SAVE';
export const EDITOR_SETTINGS_OPEN_ALL = 'EDITOR:SETTINGS:OPEN_ALL';

export function settingsReducer(state: SettingsState = new SettingsState(), action: Action) {

    if (state.debug) console.log(action);

    switch (action.type) {
        case EDITOR_SETTINGS_DEBUG: {
            let debug;
            if (action.payload === void 0) {
              debug = !state.debug;
            } else {
              debug = action.payload;
            }

            return Object.assign(new SettingsState(), state, { debug });
        }
        case EDITOR_SETTINGS_AUTO_SAVE: {
            const autoSaveInterval = Math.abs(action.payload) || 0;

            return Object.assign(new SettingsState(), state, { autoSaveInterval });
        }
        case EDITOR_SETTINGS_OPEN_ALL: {
            let openAll;
            if (action.payload === void 0) {
              openAll = !state.openAll;
            } else {
              openAll = action.payload;
            }

            return Object.assign(new SettingsState(), state, { openAll });
        }
        default: {
          return state;
        }
    }
}