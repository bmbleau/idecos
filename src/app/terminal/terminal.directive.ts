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
    this.terminal.writeln('  _____   _____    ______    _____    ____     _____ ');
    this.terminal.writeln(' |_   _| |  __ \\  |  ____|  / ____|  / __ \\   / ____|');
    this.terminal.writeln('   | |   | |  | | | |__    | |      | |  | | | (___  ');
    this.terminal.writeln('   | |   | |  | | |  __|   | |      | |  | |  \\___ \\ ');
    this.terminal.writeln('  _| |_  | |__| | | |____  | |____  | |__| |  ____) |');
    this.terminal.writeln(' |_____| |_____/  |______|  \\_____|  \\____/  |_____/ ');
    this.terminal.writeln('');
    this.writeLocalMessage(`This feature is currently not implemented... `);
    this.terminal.write('idecos@localhost / $ ');
    
  }
  
  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.terminal.fit();
  }
  
  get element() {
    return this._element.nativeElement;
  }
}