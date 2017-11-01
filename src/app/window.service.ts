import { Injectable } from '@angular/core';
import { IdentityService } from './identity.service';

@Injectable()
export class WindowService {
  constructor() {}
  
  get window(): any {
    return (window as any);
  }

  get fileSystem() {
    if (this.isChromeApp) {
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
  
  get contextmenu() {
    return this.window.contextmenu;
  }
  
  get identity() {
    if (this.isChromeApp) return this.window.chrome.identity;
  }
  
  get storage() {
    if (this.isChromeApp) return this.window.chrome.storage;
  }
  
  get isChromeApp() {
    return !!this.window.chrome;
  }
  
  get i18n() {
    if (this.isChromeApp) return this.window.chrome.i18n;
  }
}