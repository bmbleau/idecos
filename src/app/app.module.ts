import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PluginDirective } from './plugin/plugin.directive';

import { EditorComponent } from './editor/editor.component';

@NgModule({
  declarations: [
    AppComponent,
    PluginDirective,
    EditorComponent,
  ],
  entryComponents: [
    EditorComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
