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

@Directive({
  selector: '[monacoEditor]',
})
export class MonacoEditorDirective {
  @Input() options?: {
    [name: string]: any,
  };
  @Input() theme?: {
    [name: string]: any,
  };
  @Input() set language(_language: string) {
    if (_language !== this._language) {
      this._language = _language;
      this.updateLanguage(_language);
    }
  };
  @Input('monacoEditor') set value(_value: string) {
    if ((_value !== this._value) && (this.editor)) {
      // this triggers the updateValue method once the editor
      // updates it's value. So we should be doing this if the
      // editor exists, otherwise call updateValue directly.
      this.editor.setValue(_value);
    } else if (_value !== this._value) {
      this.updateValue(_value);
    }
  };

  @Output() update = new EventEmitter();
  @Output() instance = null;

  private editor;
  private _language: string;
  private _value: string;

  constructor(
    private _element: ElementRef,
    private cdr: ChangeDetectorRef
  ) { }
  
  public ngOnInit() {
    // FIXME: We are relying on this to detect changes in the editor, and
    // inform angular to update the rest of the view. We should find a less
    // hacky way of handling this...
    this.cdr.detach();
    setInterval(() => {
      this.cdr.detectChanges();
    }, 500);
  }
  
  private initEditor() {
    this.editor = (window as any).monaco.editor.create(this.element, this.editorSettings);
    
    if (this.theme) {
      (window as any).monaco.editor.defineTheme('custom', this.theme);
      (window as any).monaco.editor.setTheme('custom');
    }
    
    this.editor
      .getModel()
      .onDidChangeContent((_) => {
        const value = this.editor.getModel().getValue();
        this.updateValue(value);
      });
  }
  
  public ngAfterViewInit() {
    const onGotAmdLoader = () => {
      (<any>window).require.config({ paths: { 'vs': 'assets/monaco/vs' } });
      (<any>window).require(['vs/editor/editor.main'], () => {
        this.initEditor();
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
  
  private updateValue(value: string) {
    this._value = value;
    this.onChange(value);
    this.onTouched();
    this.update.emit(value);
  }
  
  public onChange(value: any) {
    if (this.editor) {
      this.editor.layout();
    }
  }
  
  public onTouched() {}
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // FIXME: This is a hack to get the editor layout to resize with the window
    // correctly. We need it to not be relient on the id in the template.
    if (this.editor) this.editor.layout();
    // {
    //   width: this.element.clientWidth,
    //   height: document.getElementById('editor').clientHeight - 40,
    // }
  }
  
  public updateLanguage(language: string) {
    if (this.editor) {
      (window as any).monaco.editor.setModelLanguage(this.editor.getModel(), language);
    }
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
  
  get element() {
    return this._element.nativeElement;
  }
}