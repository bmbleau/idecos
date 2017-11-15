import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ChangeDetectorRef,
} from "@angular/core";
import { WindowService } from '../window.service';
import { EditorLanguageMap } from './language.map';
import { FileService } from '../file.service';

@Directive({
  selector: "[monacoEditor]",
})
export class MonacoEditorDirective {
  private allowResizing: boolean = true;
  private value: string;
  private file;
  public editor;

  @Input() options;
  @Input() directory;
  @Input('file') set _file(file) {
    this.file = file;
    if (this.editor && file) {
      const model = this.findModel(file.fullPath);
      if (model) {
        this.editor.setModel(model);
      }
    }
  }
  @Input() theme;
  @Input() saveFileHandler;
  
  @Output('models') public exportModels: EventEmitter<any[]> = new EventEmitter();
  @Output() public update: EventEmitter<string> = new EventEmitter();
  @Output() public position: EventEmitter<{
    column: number,
    lineNumber: number,
  }> = new EventEmitter();

  constructor(
    private FileService: FileService,
    private _element: ElementRef,
    private changeDetector: ChangeDetectorRef,
  ) { }
  
  public ngAfterViewInit() {
    const onGotAmdLoader = () => {
      (window as any).require.config({ paths: { 'vs': 'vendor/monaco/vs' } });
      (window as any).require(['vs/editor/editor.main'], () => {
        this.initMonaco();
      });
    };

    if (!(window as any).require) {
      const loaderScript = document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = 'vendor/monaco/vs/loader.js';
      loaderScript.addEventListener('load', onGotAmdLoader);
      document.body.appendChild(loaderScript);
    } else {
      onGotAmdLoader();
    }
  }
  
  private digest() {
    this.changeDetector.detach();
    this.changeDetector.detectChanges();
    this.changeDetector.reattach();
  }
  
  private initMonaco() {
    this.configureTypeScript({
      experimentalDecorators: true,
      allowNonTsExtensions: true,
      noEmit: true,
      noLib: true,
      target: this.monaco.languages.typescript.ScriptTarget.ES2016,
      moduleResolution: this.monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: this.monaco.languages.typescript.ModuleKind.CommonJS,
    });

    this.editor = this.monaco.editor.create(this.element, this.settings);
    this.registerModels(this.directory)
      .then(() => {
        const model = this.findModel(this.file.fullPath);
        if (model) {
          this.editor.setModel(model);
        }
        
        this.exportModels.next(this.models);
      });
    if (this.theme) this.registerTheme('custom', this.theme);

    this.editor.addCommand([
      this.monaco.KeyMod.CtrlCmd | this.monaco.KeyCode.KEY_S
    ], (event) => {
      this.saveFileHandler();
      setTimeout(this.digest.bind(this), 500);
    });

    this.editor
      .onDidChangeModelContent((_) => {
        const model = this.editor.getModel();
        if (model.getValue) {
          const editorValue = model.getValue();
          if (editorValue !== this.value) {
            this.value = editorValue;
            this.update.next(editorValue);
            this.digest();
          } 
        }
      });

    this.editor
      .onDidChangeModel((_) => {
        this.exportModels.next(this.models);
        this.position.next({ lineNumber: 0, column: 0 } );
        const model = this.editor.getModel();
        if (model.getValue) {
          const editorValue = model.getValue();
          if (editorValue !== this.value) {
            this.value = editorValue;
            this.update.next(editorValue);
            this.digest();
          } 
        }
      });

    this.editor
      .onDidChangeCursorPosition((event) => {
        this.position.next({
          lineNumber: event.position.lineNumber,
          column: event.position.column
        });
        this.digest();
      });
  }
  
  private registerTheme(name, theme) {
    this.monaco.editor.defineTheme(name, this.theme);
    this.monaco.editor.setTheme(name);
  }
  
  // Recursively goes through all the known files and loads their models
  // into the editor's instance.
  private registerModels(entry) {
    if (!entry) return undefined;
    
    if (entry.isFile) {
      return Promise.resolve(this.registerModel(entry));
    } else if (entry.isDirectory) {
      return Promise.all(entry.contents.map(this.registerModels.bind(this)));
    }
  }
  
  private getFileExtension(entry) {
    if (entry.isFile) {
      const fullPath = entry.fullPath;
      return fullPath.split('.').pop();
    }

    return undefined;
  }

  // registers a model with the editor, should it already exist we destroy
  // the old modal to recreate it.
  private async registerModel(entry) {
    const fullPath = entry.fullPath;

    // do not reregister models already within the editor.
    if (this.findModel(fullPath)) return this.findModel(fullPath);
    
    const contents = await this.FileService.getContents(entry);
    const extension = entry.name.split('.').pop();
    const language = EditorLanguageMap[extension];

    return this.monaco.editor.createModel(contents, language, fullPath);
  }
  
  private findModel(uri) {
    return this.models.find(model => model.uri === uri);
  }
  
  private configureTypeScript(settings) {
    const regex = new RegExp(/^(?=.*\btsconfig\b)(?=.*\bjson\b).*$/);
    this.directory.contents.forEach(item => {
      if (regex.test(item.name)) {
        this.monaco.languages.typescript.typescriptDefaults.setCompilerOptions(Object.assign(
          {},
          settings,
          this.FileService.getContents(item, true)
        ));
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  private resizeHandler() {
    if (this.allowResizing) {
      this.allowResizing = false;
      
      // get the window height and width and calculate the editor's.
      const doc = (document as any).getElementsByTagName('body')[0];
      const width = doc.clientWidth - this.element.offsetLeft;
      const height = doc.clientHeight - 40 - 30;
      
      // Resize the editor should it exist.
      if (this.editor) this.editor.layout({
        width,
        height,
      });
      
      // delay the resizing event so not to have it trigger
      // faster then what the editor is able to keep up with.
      setTimeout(() => {
        this.allowResizing = true;
      }, 500);
    }
  }
  
  get settings() {
    return Object.assign({
      theme: 'vs-dark',
    }, this.options);
  }
  
  set model(model) {
    if (this.editor) {
      this.editor.setModel(model);
    }
  }
  
  get model() {
    if (this.editor) {
      return this.editor.getModel();
    }
    
    return undefined;
  }
  
  get models() {
    if (this.monaco && this.monaco.editor) {
      return this.monaco.editor.getModels();
    }
    
    return [];
  }
  
  get monaco() {
    return (window as any).monaco;
  }
  
  get element() {
    return this._element.nativeElement;
  }
}