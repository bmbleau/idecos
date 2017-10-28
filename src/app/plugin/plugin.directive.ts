import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[plugin-root]',
})
export class PluginDirective {
  constructor(
    public viewContainerRef: ViewContainerRef
  ) { }
}