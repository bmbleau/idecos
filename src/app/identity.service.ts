import { Injectable } from '@angular/core';
import { WindowService } from './window.service';

@Injectable()
export class IdentityService {
  constructor(
    private window: WindowService
  ) { }
  
  public getProfileUserInfo() {
    if (this.window.isChromeApp) {
      return new Promise(resolve => {
        this.window.identity.getProfileUserInfo(resolve.bind(this));
      });
    }
  }
  
  public getAccounts() {
    if (this.window.isChromeApp) {
      return new Promise(resolve => {
        this.window.identity.getAccounts(resolve.bind(this));
      });
    }
  }
}