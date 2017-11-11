import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class ModalService {
  public activeModal: BehaviorSubject<any> = new BehaviorSubject(undefined);
  public modals: any[] = [];
  
  public activateModal(index) {
    this.modals.forEach((modal, _index) => {
      modal.isSelected = (_index === index);
    });
    this.activeModal.next(this.metadata);
  }
  
  public deactivateModal() {
    this.modals.forEach((modal) => {
      modal.isSelected = false;
    });
    this.activeModal.next(undefined);
  }
  
  public register(modalMetadata): number {
    const modalId = this.modals.push(Object.assign({
      isSelected: false,
    }, modalMetadata));
    this.activeModal.next(this.metadata);
    
    // push returns the length, we need the index
    return modalId - 1;
  }
  
  public deregister(activeModal) {
    if (!activeModal.isSelected) {
      this.modals = this.modals.filter(modal => {
        return modal !== activeModal;
      });
    }
  }
  
  public getModal(index) {
    return this.modals[index];
  }
  
  get index() {
    return this.modals.findIndex(modal => modal.isSelected);
  }
  
  get metadata() {
    return this.modals.find(modal => modal.isSelected);
  }
  
  get isSelected() {
    return this.metadata.isSelected;
  }
  
  get component() {
    return this.metadata.component;
  }
}