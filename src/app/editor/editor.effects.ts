import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { FileService } from '../file.service';

@Injectable()
export class EditorEffects {
  constructor(
    private actions$: Actions,
    private FileService: FileService,
  ) { }
  
  // On the initalization of the store we dispatch a load
  // directory action event that injects the directory
  // filesystem into the state of the application.
  @Effect({
    dispatch: true,
  })
  private loadProject$ = this.actions$
    .ofType('@ngrx/store/init')
    .switchMap((action, index) => {
      const processDirectory = this.FileService.processDirectory;
      const readDirectory = this.FileService.readDirectory;
      const processFiles = this.FileService.processFiles;
      
      let rootDirectory;
      const projectPromises = this.FileService.openDirectory()
        .then(directory => {
          rootDirectory = directory;
          return directory;
        })
        .then(readDirectory)
        .then(processDirectory)
        .then(processFiles)
        .then(subEntries => {
          rootDirectory.contents = subEntries;
          return rootDirectory;
        });

      return Observable.fromPromise(projectPromises)
        .map(directory => {
          return {
            type: 'editor:directory:load',
            payload: directory,
          };
        });
    });
    
    @Effect({
      dispatch: false,
    })
    private saveTab$ = this.actions$
      .ofType('editor:tab:save')
      .switchMap((action, index) => {
        const tab = action.payload;
        const savePromise = this.FileService.saveFile(tab, tab.contents);
        return Observable.fromPromise(savePromise);
      });
}