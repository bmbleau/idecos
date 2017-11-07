import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { FileService } from '../file.service';
import { StorageService } from '../storage.service';

@Injectable()
export class EditorEffects {
  constructor(
    private actions$: Actions,
    private FileService: FileService,
    private StorageService: StorageService,
  ) { }
  
  private openProject() {
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
    
    return projectPromises;
  }
  
  private openDirectory(_directory?) {
    const readDirectory = this.FileService.readDirectory;
    const processSingleDirectory = this.FileService.processSingleDirectory;
    const processFiles = this.FileService.processFiles;
    let rootDirectory;

    const initPromise = !!_directory ?
      Promise.resolve(_directory) :
      this.FileService.openDirectory();

    const projectPromises = initPromise
      .then(directory => {
        rootDirectory = directory;
        return directory;
      })
      .then(readDirectory)
      .then(processSingleDirectory)
      .then(processFiles)
      .then(subEntries => {
        rootDirectory.contents = subEntries;
        return rootDirectory;
      });
    
    return projectPromises;
  }
  
  @Effect({
    dispatch: true,
  })
  private updateFileTree$ = this.actions$
    .ofType('editor:open:directory')
    .switchMap((action) => {
      const directoryPromise = this.openDirectory(action.payload)
      return Observable.fromPromise(directoryPromise)
        .map(directory => {
          return {
            type: 'editor:directory:update',
            payload: {
              child: directory,
              parent: action.payload,
            },
          };
        });
    });


  @Effect({
    dispatch: true,
  })
  private initProject$ = this.actions$
    .ofType('@ngrx/store/init')
    .switchMap(() => {
      const projectPromise = this.openDirectory();
      return Observable.fromPromise(projectPromise)
        .map(directory => {
          return {
            type: 'editor:directory:load',
            payload: directory,
          };
        });
    });
  
  @Effect({
    dispatch: true,
  })
  private newProject$ = this.actions$
    .ofType('editor:project:new')
    .switchMap((action, index) => {
      return Observable.of({
        type: 'editor:project:close',
      },{
        type: 'editor:project:open',
      });
    });
    
  @Effect({
    dispatch: true,
  })
  private openAllDirectories$ = this.actions$
    .ofType('editor:project:open_all')
    .switchMap((action) => {
      const directoryPromise = this.openProject()
      return Observable.fromPromise(directoryPromise)
        .map(directory => {
          return {
            type: 'editor:directory:update',
            payload: {
              child: directory,
              parent: action.payload,
            },
          };
        });
    });
  
  @Effect({
    dispatch: true,
  })
  private loadProject$ = this.actions$
    .ofType('editor:project:open')
    .switchMap((action, index) => {
      const projectPromise = this.openDirectory();
      return Observable.fromPromise(projectPromise);
    })
    .switchMap((directory) => {
      return Observable.from([{
        type: 'editor:directory:load',
        payload: directory,
      }]);
    });


  @Effect({
    dispatch: true,
  })
  private closeProject$ = this.actions$
    .ofType('editor:project:close')
    .switchMap((action, index) => {
      return Observable.fromPromise(this.StorageService.remove('directoryKey'));
    })
    .switchMap(() => {
      return Observable.of({
        type: 'editor:directory:unload'
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