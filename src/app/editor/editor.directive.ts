import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditorLanguage, EditorTheme, EditorOptions } from './editor.state';
import { WindowService } from '../window.service';

@Directive({
  selector: '[monacoEditor]',
})
export class MonacoEditorDirective {
  private detectChangeInterval: number;
  private _language: EditorLanguage;
  private _value: string;
  private allowResizing: boolean = true;
  private editor;

  // Use the monacoEditor attribute to get the code/value
  // to display within the editor.
  @Input('monacoEditor') set code(code: string) {
    let value;
    const _code = typeof code === 'string' ? code : `${code}`;
    if (_code !== '[object Event]') {
      if (this.editor) value = this.editor.getModel().getValue();
      if (this._value !== _code) this._value = _code;
      if (this.editor && value !== _code) this.editor.getModel().setValue(_code);
    }
  }
  
  // take the language passed in on the language attribute
  // to update the editor's language.
  @Input() set language(language: EditorLanguage) {
    if (language !== this._language) {
      this._language = language;
      this.updateLanguage(language);
    }
  }

  @Input() options?: EditorOptions;
  @Input() theme?: EditorTheme;
  
  @Input() saveFileHandler?: Function = () => {};

  @Output() public update: EventEmitter<string> = new EventEmitter();

  constructor(
    private _element: ElementRef,
    private window: WindowService,
    private cdr: ChangeDetectorRef
  ) { }
  
  public ngAfterViewInit() {
    const onGotAmdLoader = () => {
      (<any>window).require.config({ paths: { 'vs': 'assets/monaco/vs' } });
      (<any>window).require(['vs/editor/editor.main'], () => {
        this.initMonaco();
      });
    };

    if (!(<any>window).require) {
      const loaderScript = document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = 'assets/monaco/vs/loader.js';
      loaderScript.addEventListener('load', onGotAmdLoader);
      document.body.appendChild(loaderScript);
    } else {
      onGotAmdLoader();
    }
  }
  
  private updateLanguage(language: EditorLanguage) {
    if (this.model) this.monaco.editor
      .setModelLanguage(this.model, language);
  }
  
  private digest() {
    this.cdr.detach();
    this.cdr.detectChanges();
    this.cdr.reattach();
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
  
  private initMonaco() {
    this.editor = this.monaco.editor.create(this.element, this.editorSettings);
    if (this.theme) {
      this.monaco.editor.defineTheme('custom', this.theme);
      this.monaco.editor.setTheme('custom');
    }
    
    this.editor.addCommand([
      this.monaco.KeyMod.CtrlCmd | this.monaco.KeyCode.KEY_S
    ], (event) => {
      this.saveFileHandler();
      setTimeout(this.digest.bind(this), 500);
    });

    this.editor
      .getModel()
      .onDidChangeContent((_) => {
        const editorValue = this.editor.getModel().getValue();
        if (editorValue !== this._value) {
          this.update.next(editorValue);
          this.digest();
        }
      });
  }
  
  get editorSettings() {
    return Object.assign(
      {
        value: this._value,
        language: this._language,
      },
      this.options,
    );
  }
  
  get model() {
    return this.editor && this.editor.getModel() || undefined;
  }
  
  get element() {
    return this._element.nativeElement;
  }
  
  get monaco(): any {
    return (window as any).monaco;
  }
}