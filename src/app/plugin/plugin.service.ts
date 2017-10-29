import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class PluginService {
  public update: BehaviorSubject<any> = new BehaviorSubject(undefined);
  public plugins: any[] = [];
  
  public selectPlugin(index) {
    this.plugins.forEach((plugin, _index) => {
      plugin.isSelected = (_index === index);
    });
    this.update.next(this.metadata);
  }
  
  public register(pluginMetadata) {
    this.plugins.push(Object.assign({
      isSelected: this.metadata ? false : true,
    }, pluginMetadata));
    this.update.next(this.metadata);
  }
  
  public deregister(pluginMetadata) {
    if (!pluginMetadata.isSelected) {
      this.plugins = this.plugins.filter(plugin => {
        return plugin !== pluginMetadata;
      });
    }
  }
  
  get index() {
    return this.plugins.findIndex(plugin => plugin.isSelected);
  }
  
  get metadata() {
    return this.plugins.find(plugin => plugin.isSelected);
  }
  
  get title() {
    return this.metadata.title;
  }
  
  get isSelected() {
    return this.metadata.isSelected;
  }
  
  get component() {
    return this.metadata.component;
  }
}