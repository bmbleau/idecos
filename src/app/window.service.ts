import { Injectable } from '@angular/core';

@Injectable()
export class WindowService {
  get window(): any {
    return (window as any);
  }

  get fileSystem() {
    if (!!this.window.chrome) {
      return this.window.chrome.fileSystem;
    }

    return this.window.fileSystem || this.window.webkitFileSystem;
  }
  
  get mousetrap() {
    return this.window.Mousetrap;
  }
  
  get require() {
    return this.window.require;
  }
  
  get monaco() {
    return this.window.monaco;
  }
  
  get document() {
    return this.window.document;
  }
}