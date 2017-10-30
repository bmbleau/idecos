import { Injectable } from '@angular/core';

Injectable()
export class ContextMenuService {
  static contextMenuTypes: string[] = [];
  
  get contextMenuTypes() {
    return ContextMenuService.contextMenuTypes;
  }
  
  set contextMenuTypes(value: string[]) {
    ContextMenuService.contextMenuTypes = value;
  }
}