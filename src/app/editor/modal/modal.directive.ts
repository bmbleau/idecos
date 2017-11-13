import {
  Directive,
  ViewContainerRef,
  ElementRef,
  ComponentFactoryResolver,
} from '@angular/core';
import { ModalService } from './modal.service';
import { ModalComponent } from './modal.component';
import { Modal } from './modal';
import { Subscription } from 'rxjs/Rx';

@Directive({
  selector: '[modal]',
})
export class ModalDirective {
  private activeModalSub: Subscription;
  
  constructor(
    private modalService: ModalService,
    private _element: ElementRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    public viewContainerRef: ViewContainerRef,
  ) { }
  
  public ngOnInit() {
    this.activeModalSub = this.modalService.activeModal.subscribe(modal => {
      if (modal && this.element) {
        if ((!this.hasClass('active')) &&
          (this.modalService.index !== -1)) {
          this.show();
        } else if (this.hasClass('active')) {
          this.hide();
        }
      }
    });
  }
  
  public ngOnDestroy() {
    if (this.activeModalSub) this.activeModalSub.unsubscribe();
    this.hide();
  }
  
  public show() {
    const modal = this.modalService.metadata;
    this.loadModal(modal);
    this.addClass('active');
  }
  
  public hide() {
    this.viewContainerRef.clear();
    this.removeClass('active');

    // When we close the modal we also want to remove it
    // from the service (as it is no longer active).
    this.modalService.activateModal(-1);
  }
  
  private hasClass(className) {
    return this.element.className.includes(className);
  }
  
  private addClass(className) {
    if (this.hasClass(className)) return undefined;
    const classList = this.element.className.split(' ');
    classList.push(className);
    this.element.className = classList.join(' ');
  }
  
  private removeClass(className) {
    if (!this.hasClass(className)) return undefined;
    const classList = this.element.className.split(' ');
    this.element.className = classList.filter(_className => {
      return _className !== className;
    }).join(' ');
  }
  
  private clickHandler(event) {
    this.modalService.deactivateModal();
    this.hide();
    event.stopPropagation();
    event.preventDefault();
    return false;
  }

  public ngAfterViewInit() {
    this.element.addEventListener('click', this.clickHandler.bind(this));
  }
  
  private loadModal(modal) {
    if (!modal) return;
    
    modal = new Modal(
      modal.component,
      modal
    );
    
    // get the component factor for the currently selected plugin.
    let componentFactory = this.componentFactoryResolver
      .resolveComponentFactory(modal.component);
      
    // get the reference of the plugin container's view so to clear it.
    this.viewContainerRef.clear();
    
    // attach the component to the plugin container's view to be rendered.
    let componentRef = this.viewContainerRef.createComponent(componentFactory);
    
    // Attach the metadata to the plugin component.
    Object.keys(componentRef.instance).forEach(inputName => {
      if (modal.hasOwnProperty(inputName)) {
        componentRef.instance[inputName] = modal[inputName];
      }
    });

    (componentRef.instance as ModalComponent).metadata = modal.metadata;
    (componentRef.instance as ModalComponent).close = this.hide.bind(this);
  }
  
  get element() {
    return this._element.nativeElement;
  }
}