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
}