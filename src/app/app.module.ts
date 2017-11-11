import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { PluginDirective } from './plugin/plugin.directive';
import { PluginService } from './plugin/plugin.service';

import { EditorComponent } from './editor/editor.component';
import { FeatureService } from './editor/feature/feature.service';
import { DirectoryComponent } from './editor/directory/directory.component';
import { MonacoEditorDirective } from './editor/editor.directive';
import { LoadingComponent } from './loading/loading.component';
import { SettingsComponent } from './settings/settings.component';

import { WindowService } from './window.service';
import { FileService } from './file.service';
import { IdentityService } from './identity.service';
import { StorageService } from './storage.service';

import { ModalService } from './editor/modal/modal.service';
import { ModalDirective } from './editor/modal/modal.directive';
import { NewEntryComponent } from './editor/newEntry/newEntry.component';

// reducers
import { editorReducer } from './editor/editor.reducer';
import { EditorEffects } from './editor/editor.effects';
import { AppEffects } from './app.effects';

import { TerminalComponent } from './terminal/terminal.component';
import { TerminalDirective } from './terminal/terminal.directive';

import { ContextMenuDirective } from './contextmenu/contextMenu.directive';

import { TipsComponent } from './tips/tips.component';

@NgModule({
  declarations: [
    AppComponent,
    ContextMenuDirective,
    PluginDirective,
    ModalDirective,
    EditorComponent,
    MonacoEditorDirective,
    LoadingComponent,
    DirectoryComponent,
    TipsComponent,
    TerminalComponent,
    TerminalDirective,
    SettingsComponent,
    NewEntryComponent,
  ],
  entryComponents: [
    EditorComponent,
    TerminalComponent,
    LoadingComponent,
    TipsComponent,
    SettingsComponent,
    NewEntryComponent,
  ],
  imports: [
    BrowserModule,
    StoreModule.provideStore({ editor: editorReducer }),
    EffectsModule.run(EditorEffects),
    EffectsModule.run(AppEffects),
  ],
  providers: [
    PluginService,
    ModalService,
    WindowService,
    FileService,
    IdentityService,
    StorageService,
    FeatureService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
