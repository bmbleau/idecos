import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import {
  EDITOR_SETTINGS_OPEN_ALL,
  EDITOR_SETTINGS_AUTO_SAVE,
  EDITOR_SETTINGS_DEBUG
} from './settings.reducer';
import { StorageService } from '../storage.service';

Injectable()
export class SettingsEffects {
  private settingsMap = {
    'EDITOR:SETTINGS:DEBUG': "debug",
    'EDITOR:SETTINGS:AUTO_SAVE': "autoSaveInterval",
    'EDITOR:SETTINGS:OPEN_ALL': "openAll",
  };

  constructor(
    private store$: Store<any>,
    private actions$: Actions,
    private storageService: StorageService,
  ) { }
  
  public isEmptyObj(obj) {
    let isEmpty = true;
    Object.keys(obj).forEach(key => {
      isEmpty = isEmpty && !obj.hasOwnProperty(obj[key]);
    });
    return isEmpty;
  }

  @Effect()
  private initSettings$ = this.actions$
    .ofType('@ngrx/store/init')
    .withLatestFrom(this.store$)
    .switchMap(([action, store]) => {
      const settingTypes = Object.keys(this.settingsMap);

      const settings = settingTypes.map(settingType => {
        return this.storageService.get(settingType)
          .then(value => {
            const stateValue = store.settings[this.settingsMap[settingType]];
            if (value[settingType] === void 0) return stateValue;
            return value[settingType];
          });
      });

      return Observable.fromPromise(
        Promise.all(settings)
          .then((_settings) => {
            console.log(_settings);
            return _settings.map((_setting, index) => {
              return {
                type: settingTypes[index],
                payload: _setting,
              };
            });
          }),
      ).flatMap(event => event);
    });

  @Effect()
  private saveSetting$ = this.actions$
    .ofType('EDITOR:SETTINGS:SAVE')
    .withLatestFrom(this.store$)
    .switchMap(([action, store]) => {
      const type = action.payload.setting;
      
      let payload;
      if (action.payload.value === void 0) {
        payload = !store['settings'][this.settingsMap[type]];
      } else {
        payload = action.payload.value;
      }

      console.log(type, payload);

      const storeSettingPromise = this.storageService.set(type, payload);
      return Observable.fromPromise(storeSettingPromise.then(res => {
        return {
          type,
          payload,
        };
      }));
    });

}