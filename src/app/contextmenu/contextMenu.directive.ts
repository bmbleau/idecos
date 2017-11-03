import { Directive, ViewContainerRef, ElementRef, Input } from '@angular/core';
import { WindowService } from '../window.service';

@Directive({
  selector: '[context-menu]',
})
export class ContextMenuDirective {
  private _menu;
  @Input('context-menu') set menu(menu: any[]) {
    this._menu = this.window.contextmenu(menu);
  };
  
  constructor(
    private window: WindowService,
    private _element: ElementRef
  ) { }

  public ngOnInit() {
    this.window.contextmenu.attach(this.element, this._menu);
  }
  
  public ngOnChanges() {
    this.window.contextmenu.attach(this.element, this._menu);
  }

  get element() {
    return this._element.nativeElement;
  }
}