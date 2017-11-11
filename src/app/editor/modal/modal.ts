import { Type } from '@angular/core';

export class Modal {
  constructor(
    public component: Type<any>,
    public metadata: any
  ) {}
}
