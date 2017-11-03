import { Component, Input } from '@angular/core';
import { PluginComponent } from '../plugin/plugin.component';

@Component({
  selector: 'terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements PluginComponent {
  @Input() metadata: any;
}
