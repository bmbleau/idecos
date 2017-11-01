import { Injectable } from '@angular/core';
import { WindowService } from './window.service';

@Injectable()
export class StorageService {
  constructor(
    private window: WindowService,
  ) { }
  
  public get(key: string) {
    return new Promise(resolve => {
      this.window.storage.local.get(key, resolve.bind(this));
    });
  }
  
  public set(key: string, value: any) {
    return new Promise(resolve => {
      const storageObject = {};
      storageObject[key] = value;
      this.window.storage.local.set(storageObject, resolve.bind(this));
    });
  }
  
  public remove(key: string) {
    return new Promise(resolve => {
      this.window.storage.local.remove(key, resolve.bind(this));
    });
  }
}