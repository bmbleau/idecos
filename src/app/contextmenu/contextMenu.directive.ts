import {
  Directive,
  Input,
  ElementRef,
  ViewContainerRef,
  ComponentFactoryResolver,
} from '@angular/core';
import { ContextMenuComponent } from './contextMenu.component';

@Directive({
  selector: '[context-menu]',
  host:{
    '(contextmenu)':'contextMenuHandler($event)'
  }
})
export class ContextMenuDirective {
  @Input('context-menu') menu;
  
  private eventListenerSub;

  constructor(
    private _element: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }
  
  public contextMenuHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    this.loadMenu(event);
  }
  
  private get element() {
    return this._element.nativeElement;
  }
  
  private close() {
    this.viewContainerRef.clear();
  }
  
  private loadMenu(event) {
    let componentFactory = this.componentFactoryResolver
      .resolveComponentFactory(ContextMenuComponent);

    this.viewContainerRef.clear();

    let componentRef = this.viewContainerRef.createComponent(componentFactory);
    componentRef.instance.close = this.close.bind(this);
    componentRef.instance.menu = this.menu;
    componentRef.instance.clickEvent = event;
  }
}