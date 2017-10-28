import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { PluginDirective } from './plugin/plugin.directive';
import { PluginComponent } from './plugin/plugin.component';
import { Plugin } from './plugin/plugin';

import { EditorComponent } from './editor/editor.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild(PluginDirective) plugin: PluginDirective;
  public plugins: any[] = [
    {
      title: 'A',
      isSelected: true,
      component: EditorComponent
    }
  ];
  
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
  ) { }
  
  public ngOnInit() {
    this.loadPlugin();
  }
  
  public selectPlugin(index) {
    this.plugins.forEach((plugin, _index) => {
      plugin.isSelected = (_index === index);
    });
    this.loadPlugin();
  }
  
  private loadPlugin() {
    const plugin = new Plugin(this.selectedPlugin.component, this.selectedPlugin);
    let componentFactory = this.componentFactoryResolver
      .resolveComponentFactory(plugin.component);
      
    let viewContainerRef = this.plugin.viewContainerRef;
    viewContainerRef.clear();
    
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<PluginComponent>componentRef.instance).metadata = plugin.metadata;
  }
  
  get selectedPlugin() {
    return this.plugins.find(plugin => plugin.isSelected);
  }
}
