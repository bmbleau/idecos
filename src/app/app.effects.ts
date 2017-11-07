import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { WindowService } from './window.service';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private window: WindowService,
  ) { }

  @Effect({
    dispatch: false,
  })
  private close$ = this.actions$
    .ofType('window:close')
    .map((action, index) => {
      this.window.close();
    });
    
  @Effect({
    dispatch: false,
  })
  private minimize$ = this.actions$
    .ofType('window:minimize')
    .map((action, index) => {
      this.window.minimize();
    });
    
  @Effect({
    dispatch: false,
  })
  private restore$ = this.actions$
    .ofType('window:restore')
    .map((action, index) => {
      this.window.restore();
    });
}