import { Type } from '@angular/core';

export class Plugin {
  constructor(
    public component: Type<any>,
    public metadata: any
  ) {}
}
