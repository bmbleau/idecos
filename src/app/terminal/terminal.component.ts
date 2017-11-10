import { Component, Input, ViewChild } from '@angular/core';
import { PluginComponent } from '../plugin/plugin.component';
import { Store } from '@ngrx/store';
import { TerminalDirective } from './terminal.directive';
import * as TerminalPrograms from './programs';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
})
export class TerminalComponent implements PluginComponent {
  @Input() metadata: any;
  @Input() standalone: boolean = true;
  @ViewChild(TerminalDirective) terminal;
  private command = [];
  
  private _programs = TerminalPrograms;
  
  constructor(
    private store$: Store<any>,
  ) { }
  
  public ngOnInit() {
    this.terminal.terminalPrompt();
    this.terminal.on('keypress', this.onKeypress.bind(this));
    this.terminal.on('key', this.onLineFeed.bind(this));
    this.terminal.on('click', (event) => {
      event.preventDefault();
      return false;
    });
  };
  
  private getProgram(command, args) {
    const program = this.programs.find((program: any, index: number, programs: any[]) => {
      return program.name === command;
    });
    
    if (program) return Promise.resolve([program, command, args]);
    const conditionalError = Array.isArray(args) && args.length ? `with args ${args}` : '';
    return Promise.reject([`Unable to execute command ${command} ${conditionalError}`, command, args]);
  };
  
  private callProgram([program, command, args]) {
    const response = program.script.call(this, this.terminal, args);
    return [response, command, args];
  };
  
  private printError([error, command, args]) {
    this.terminal.write(`${error}`);
    this.terminal.terminalPrompt();
    return Promise.reject(error);
  }
  
  private printSuccess([response, command, args]) {
    if (Array.isArray(response)) {
      response.forEach(this.terminal.writeln.bind(this));
    } else if (response !== null) {
      this.terminal.writeln(response.toString());
    }
  
    this.terminal.terminalPrompt();
  }
  
  private onLineFeed(key, event) {
    switch (event.key) {
      case 'Enter': {
        const commandArgs = this.command.join('').split(/\s/);
        const command = commandArgs.shift();
        this.command = [];
        this.terminal.newLine();
        
        // find and execute the program.
        this.getProgram(command, commandArgs)
            .then(this.callProgram.bind(this))
            .catch(this.printError.bind(this))
            .then(this.printSuccess.bind(this));
        break;
      }
      case 'Backspace': {
        this.terminal.backspace(this.command);
      }
    }
  }

  private onKeypress(key, event) {
    this.terminal.print(key);
    this.command.push(key);
  }
  
  @Input() get programs() {
    return  Object.keys(this._programs)
                  .filter(program => !program.includes('_help'))
                  .map(name => {
                    return {
                      name,
                      script: this._programs[name],
                      help: this._programs[`${name}_help`],
                    };
                  });
  }

  get state() {
    let state = null;
    this.store$.take(1).subscribe(_state => state = _state);
    return state;
  }
}
