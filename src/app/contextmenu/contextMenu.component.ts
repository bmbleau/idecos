import {
  Component,
  HostBinding,
  ElementRef,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'contextmenu',
  templateUrl: './contextMenu.component.html',
  styleUrls: ['./contextMenu.component.css'],
  host: {
    '(click)': 'closeMenu($event)',
    '(contextmenu)': 'closeMenu($event)'
  }
})
export class ContextMenuComponent {
  @HostBinding('tabindex') tabindex = -1;
  @Input() close;
  @Input() menu;
  @Input() clickEvent;
  @ViewChild('contextmenu') menuElement: ElementRef;
  
  constructor(
    private _element: ElementRef,
    private viewContainerRef: ViewContainerRef,
  ) {}
  
  public ngAfterViewInit() {
    this.element.focus();
    
    const windowHeight = (window as any).innerHeight;
    const windowWidth = (window as any).innerWidth;
    const menuHeight = this.menuElement.nativeElement.clientHeight;
    const menuWidth = this.menuElement.nativeElement.clientWidth;

    let left = this.clickEvent.clientX;
    let top = this.clickEvent.clientY;

    // Account for the user clicking close to a corner of the window.
    if (windowWidth - left <= menuWidth + 10) left -= menuWidth;
    if (windowHeight - top <= menuHeight + 10) top -= menuHeight;
    
    // apply the position of the menu based on the mouse click's
    // position from the top left of the application.
    this.menuElement.nativeElement.setAttribute('style', `
      top: ${top}px;
      left: ${left}px;
    `);
  }
  
  public closeMenu(event) {
    event.preventDefault();
    this.close();
  }
  
  private get element() {
    return this._element.nativeElement;
  }
}