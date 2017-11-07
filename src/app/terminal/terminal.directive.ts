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
  private history = [];
  
  @Input() user?: string = 'idecos';
  @Input() server?: string = 'localhost';
  @Input() port?: number = 1337;
  @Input() programs: any = {};
  
  constructor(
    private _element: ElementRef,
  ) {
    Terminal.loadAddon('fit');
    this.terminal = new Terminal({
      cursorBlink: true,
    });
  }
  
  public writeLocalMessage(message: string, newLine: boolean = true) {
    const method = newLine ? 'writeln' : 'print';
    this.history.push({ method, message: `> ${message}` });
    this[method](`> ${message}`);
  }
  
  private _write(message) {
    this.history.push({ method: 'print', message: `${message}` });
    this.terminal.write(message);
  }
  
  private _writeln(message) {
    this.history.push({ method: 'writeln', message: `${message}` });
    this.terminal.writeln(message);
  }
  
  private wait(ms){
    let start = new Date().getTime();
    let end = start;
    while(end < (start + ms)) {
      end = new Date().getTime();
    }
  }
  
  private rewrite() {
    const _history = this.history.slice(0);
    this.clearTerminal(false);
    _history.forEach((item, index) => {
      this[item.method](item.message);
    });
  }

  private _terminalPrompt() {
    this.print(`${this.user}@${this.server} $ `);
  }
  
  private clearTerminal(wait: boolean = true) {
    this.history = [];
    this.terminal.reset();
    this.terminal.clear();
    if (wait) this.wait(250);
  }
  
  private _backspace(command: any[]) {
    if (command.length) {
      this.history.pop();
      this.rewrite();
      command.pop();
    }
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
  }
  
  @Output() get terminalPrompt() {
    if (this.terminal) return this._terminalPrompt.bind(this);
  }
  
  @Output() get print() {
    if (this.terminal) return this._write.bind(this);
  }
  
  @Output() get write() {
    if (this.terminal) return this.writeLocalMessage.bind(this);
  }
  
  @Output() get writeln() {
    if (this.terminal) return this._writeln.bind(this);
  }
  
  @Output() get newLine() {
    if (this.terminal) return this._writeln.bind(this, '');
  }
  
  @Output() get clear() {
    if (this.terminal) return this.clearTerminal.bind(this);
  }
  
  @Output() get backspace() {
    if (this.terminal) return this._backspace.bind(this);
  }
  
  get element() {
    return this._element.nativeElement;
  }
}
