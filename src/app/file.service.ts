import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { WindowService } from './window.service';
import * as md5 from 'md5';
import { IdentityService } from './identity.service';
import { StorageService } from './storage.service';

@Injectable()
export class FileService {
  public directory: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public projectId: string;
  
  constructor(
    private window: WindowService,
    private identity: IdentityService,
    private storage: StorageService,
  ) { }
  
  public chooseDirectory(options: { type: string }): Promise<any> {
    return new Promise(resolve => {
      this.window.fileSystem.chooseEntry(options, resolve.bind(this));
    });
  }
  
  public openDirectory() {
    return this.storage.get('directoryKey')
      .then((storage: { directoryKey: string }) => {
        if (storage.directoryKey) {
          this.projectId = storage.directoryKey;
          return storage.directoryKey;
        }

        return new Error('Project directory permission request required.');
      })
      .then(this.restoreDirectory)
      .catch((err) => {
        return this.chooseDirectory({ type: 'openDirectory' })
          .then(this.rememberDirectory.bind(this));
      });
  }
  
  public getMetadata(entry) {
    return new Promise(resolve => {
      entry.getMetadata(resolve.bind(this));
    });
  }
  
  public readDirectory(entry) {
    return new Promise(resolve => {
      entry.createReader().readEntries(resolve.bind(this));
    });
  }
  
  get processDirectory() {
    return this._processDirectory.bind(this);
  }
  
  public processSingleDirectory(entries) {
    if (!Array.isArray(entries)) entries = [entries];
    return Promise.all(entries.map(entry => {
      if (entry.isDirectory) entry.contents = [];
      return Promise.resolve(entry);
    }));
  }
  
  private _processDirectory(entries) {
    if (!Array.isArray(entries)) entries = [entries];
    return Promise.all(entries.map((entry => {
      if (entry.isFile) {
        return Promise.resolve(entry);
      }
      
      return this.readDirectory.call(this, entry)
        .then(this.processDirectory.bind(this))
        .then(directory => {
          entry.contents = directory;
          return entry;
        });
    }).bind(this)));
  }
  
  public readFileHandler(entry) {
    return new Promise(resolve => {
      entry.file(resolve.bind(this));
    });
  }
  
  get processFiles() {
    return this._processFiles.bind(this);
  }
  
  private _processFiles(entries) {
    if (!Array.isArray(entries)) entries = [entries];
    return Promise.all(entries.map((entry => {
      if (entry.isFile) {
        return Promise.resolve(entry)
          .then(this.readFileHandler)
          .then(this.readFiles)
          .then(file => {
            entry.contents = file;
            entry.md5 = md5(file);
            return entry;
          });
      }
      
      return this._processFiles(entry.contents)
        .then(subEntries => {
          entry.contents = subEntries;
          return entry;
        });
    }).bind(this)));
  }
  
  public readFiles(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.addEventListener('loadend', (event) => {
        if ((event as any).target.readyState == (FileReader as any).DONE) {
          resolve((event as any).target.result);
        }
      });
      reader.readAsText(file, 'utf8');
    });
  }
  
  public saveFile(entry, contents) {
    return this.createWriter(entry)
      .then(writer => {
        entry.md5 = md5(contents);
        return [writer, contents];
      })
      .then(this.writeFile.bind(this));
  }
  
  private createWriter(entry) {
    return new Promise(resolve => {
      entry.createWriter(resolve.bind(this));
    });
  }
  
  get rememberDirectory() {
    return this._rememberDirectory.bind(this);
  }
  
  private _rememberDirectory(directoryEntry) {
    return new Promise(resolve => {
      const projectId = this.window.fileSystem.retainEntry(directoryEntry);
      this.projectId = projectId;
      resolve(projectId);
    }).then((projectId) => {
      return this.storage.set('directoryKey', projectId);
    }).then(() => {
      return directoryEntry;
    });
  }
  
  get restoreDirectory() {
    return this._restoreDirectory.bind(this);
  }
  
  public _restoreDirectory(id) {
    return new Promise(resolve => {
      this.window.fileSystem.restoreEntry(id, resolve.bind(this));
    });
  }
  
  private writeFile([writer, file]) {
    return new Promise((resolve, reject) => {
      writer.addEventListener('writeend', (event) => {
        if (!writer.length) {
          writer.write(blob);
        } else if (event.returnValue) {
          resolve(event);
        }
      });
      writer.addEventListener('error', reject.bind(this));

      const blob = new Blob([file], {type: 'text/plain'});
      writer.truncate(0);
    });
  }
  
  public newFile(directory, name) {
    return new Promise((resolve, reject) => {
      directory.getFile(name, {create: true}, resolve.bind(this));
    });
  }
  
  public removeFile(entry) {
    return new Promise((resolve, reject) => {
      entry.remove(resolve.bind(this), reject.bind(this));
    });
  }
  
  public createDirectory(directory, name) {
    return new Promise((resolve, reject) => {
      directory.getDirectory(name, { create: true }, resolve.bind(this));
    });
  }
}