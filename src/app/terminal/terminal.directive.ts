import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import * as Terminal from 'xterm';

@Directive({
  selector: '[terminal]',
})
export class TerminalDirective {
  private terminal;
  
  @Input() user?: string = 'idecos';
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
    // const date = new Date();
    this.terminal[newLine ? 'writeln' : 'write'](`> ${message}`);
  }
  
  private _terminalPrompt() {
    this.terminal.write(`${this.user}@${this.server} $ `);
  }
  
  public ngOnInit() {
    this.terminal.open(this.element, true);
    this.terminal.fit();
    this.terminal.focus();
    
  }
  
  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.terminal.fit();
  }
  
  @Output() get on() {
    if (this.terminal) return this.terminal.on.bind(this.terminal);
    return (type, cb) => {};
  }
  
  @Output() get terminalPrompt() {
    if (this.terminal) return this._terminalPrompt.bind(this);
    return () => {};
  }
  
  @Output() get print() {
    if (this.terminal) return this.terminal.write.bind(this.terminal);
    return () => {};
  }
  
  @Output() get write() {
    if (this.terminal) return this.writeLocalMessage.bind(this);
    return () => {};
  }
  
  @Output() get writeln() {
    if (this.terminal) return this.terminal.writeln.bind(this.terminal);
    return () => {};
  }
  
  @Output() get newLine() {
    if (this.terminal) return this.terminal.writeln.bind(this.terminal, '');
    return () => {};
  }
  
  get element() {
    return this._element.nativeElement;
  }
}