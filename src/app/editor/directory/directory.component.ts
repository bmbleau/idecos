import { Component, Input, ViewEncapsulation } from '@angular/core';
// import { Store } from '@ngrx/store';

@Component({
  selector: 'directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DirectoryComponent {
  @Input() entry;
  @Input() hidden: boolean = true;
  
  constructor(
  ) { }
  
  public action() {
    if (this.entry.isFile && this.entry.action) {
      this.entry.action.call(this, this.entry);
    } else {
      this.hidden = !this.hidden;
    }
  }
}
