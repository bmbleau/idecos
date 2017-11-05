import { Component, Input, ViewChild } from '@angular/core';
import { PluginComponent } from '../plugin/plugin.component';
import { Store } from '@ngrx/store';
import { TerminalDirective } from './terminal.directive';
import { echo, dispatch, help } from './programs';

@Component({
  selector: 'terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements PluginComponent {
  @Input() metadata: any;
  @ViewChild(TerminalDirective) terminal;
  private command = [];
  
  private _programs = {
    echo,
    dispatch,
    help,
  };
  
  constructor(
    private store$: Store<any>,
  ) { }
  
  public ngOnInit() {
    this.terminal.terminalPrompt();
    this.terminal.on('keypress', this.onKeypress.bind(this));
    this.terminal.on('key', this.onLineFeed.bind(this));
  }
  
  private onLineFeed(key, event) {
    if (event.key === 'Enter') {
      const commandArgs = this.command.join('').split(/\s/);
      const command = commandArgs.shift();
      this.command = [];
      this.terminal.newLine();
      
      // find and execute the program.
      new Promise((resolve, reject) => {
        const program = this.programs.find((program: any, index: number, programs: any[]) => {
          return program.name === command;
        });
        
        if (program) resolve(program);
        reject(`Unable to execute command ${command} with args ${commandArgs}`);
      }).then((program: any) => {
        program.script.call(this, this.terminal, commandArgs);
      }).catch(err => {
        this.terminal.write(`${err}`);
      }).then(() => {
        this.terminal.terminalPrompt();
      });
    }
  }
  
  private onKeypress(key, event) {
    this.terminal.print(key);
    this.command.push(key);
  }
  
  get programs() {
    return Object.keys(this._programs).map(name => {
      return {
        name,
        script: this._programs[name],
      };
    });
  }
}
