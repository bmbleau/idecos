import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { PluginDirective } from './plugin/plugin.directive';
import { PluginComponent } from './plugin/plugin.component';
import { PluginService } from './plugin/plugin.service';
import { Plugin } from './plugin/plugin';

import { EditorComponent } from './editor/editor.component';
import { LoadingComponent } from './loading/loading.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild(PluginDirective) plugin: PluginDirective;
  
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    public pluginService: PluginService,
  ) { }
  
  public ngOnInit() {
    this.pluginService.register({icon: 'fa-file-text-o', component: EditorComponent});
    this.pluginService.register({icon: 'fa-puzzle-piece', component: LoadingComponent});
    // this.pluginService.register({icon: 'fa-sliders', component: LoadingComponent});
    this.pluginService.update.subscribe(this.loadPlugin.bind(this));
  }
  
  private loadPlugin(plugin) {
    if (!plugin) return;

    plugin = new Plugin(
      plugin.component,
      plugin
    );
    
    // get the component factor for the currently selected plugin.
    let componentFactory = this.componentFactoryResolver
      .resolveComponentFactory(plugin.component);
      
    // get the reference of the plugin container's view so to clear it.
    let viewContainerRef = this.plugin.viewContainerRef;
    viewContainerRef.clear();
    
    // attach the component to the plugin container's view to be rendered.
    let componentRef = viewContainerRef.createComponent(componentFactory);
    
    // Attach the metadata to the plugin component.
    (<PluginComponent>componentRef.instance).metadata = plugin.metadata;
  }
}
