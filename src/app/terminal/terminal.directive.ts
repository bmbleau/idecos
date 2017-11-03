import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import * as Terminal from 'xterm';

@Directive({
  selector: '[terminal]',
})
export class TerminalDirective {
  private terminal;
  private command: string[] = [];
  
  @Input() server?: string = 'localhost';
  @Input() port?: number = 1337;
  
  constructor(
    private _element: ElementRef,  
  ) {
    Terminal.loadAddon('fit');
    this.terminal = new Terminal({
      cursorBlink: true,
    });
  }
  
  public writeLocalMessage(message: string, newLine: boolean = true) {
    this.terminal[newLine ? 'writeln' : 'write'](`[IDECOS Terminal] ${message}`);
  }
  
  public ngOnInit() {
    this.terminal.open(this.element);
    this.terminal.fit();
    this.terminal.focus();
    this.writeLocalMessage(`This feature is currently not implemented...`, false);
  }
  
  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.terminal.fit();
  }
  
  get element() {
    return this._element.nativeElement;
  }
}