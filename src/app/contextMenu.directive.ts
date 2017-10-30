import { Directive, ViewContainerRef, Input } from '@angular/core';
import { ContextMenuService } from './contextMenu.service';

@Directive({
  selector: '[context-menu]',
})
export class ContextMenuDirective {
  
  constructor(
    public viewContainerRef: ViewContainerRef,
    private ContextMenuService: ContextMenuService,
  ) { }
  
  @Input('context-menu') set contextMenu(value) {
    this.ContextMenuService.contextMenuTypes.push(value);
    const uniqueMenuTypes = new Set(this.ContextMenuService.contextMenuTypes);
    this.ContextMenuService.contextMenuTypes = Array.from(uniqueMenuTypes);
  }
  
  ngOnInit() {
    console.log(this.ContextMenuService);
  }
}