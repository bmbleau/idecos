import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { PluginDirective } from './plugin/plugin.directive';
import { PluginService } from './plugin/plugin.service';

import { EditorComponent } from './editor/editor.component';
import { DirectoryComponent } from './editor/directory/directory.component';
import { MonacoEditorDirective } from './editor/editor.directive';
import { LoadingComponent } from './loading/loading.component';

import { WindowService } from './window.service';
import { FileService } from './file.service';
import { IdentityService } from './identity.service';
import { StorageService } from './storage.service';

// reducers
import { editorReducer } from './editor/editor.reducer';
import { EditorEffects } from './editor/editor.effects';

import { ContextMenuDirective } from './contextMenu.directive';
import { ContextMenuService } from './contextMenu.service';

import { TipsComponent } from './tips/tips.component';

@NgModule({
  declarations: [
    AppComponent,
    ContextMenuDirective,
    PluginDirective,
    EditorComponent,
    MonacoEditorDirective,
    LoadingComponent,
    DirectoryComponent,
    TipsComponent,
  ],
  entryComponents: [
    EditorComponent,
    LoadingComponent,
    TipsComponent,
  ],
  imports: [
    BrowserModule,
    StoreModule.provideStore({ editor: editorReducer }),
    EffectsModule.run(EditorEffects),
  ],
  providers: [
    PluginService,
    WindowService,
    ContextMenuService,
    FileService,
    IdentityService,
    StorageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
