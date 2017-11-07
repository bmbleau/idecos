function addDocumentation(args, command, cb) {
  if (!args[0] || (args[0] === command)) {
    cb();
  }
}

export function help(terminal, args) {
  terminal.writeln('IDECOS Terminal is not bash, but it does provide some useful');
  terminal.writeln('functionality. Bellow is a list of some of the commands you');
  terminal.writeln('can use.');
  terminal.newLine();
  
  addDocumentation(args, 'clear', () => {
    terminal.writeln('> clear');
    terminal.writeln('  Clears the terminal.');
    terminal.newLine();
  });
  
  addDocumentation(args, 'dispatch', () => {
    terminal.writeln('> dispatch [type] [payload]');
    terminal.writeln('  dispatches an event of the given type (arg[0]) to the store');
    terminal.writeln('  with a payload (arg[1]).');
    terminal.newLine();
  });

  addDocumentation(args, 'echo', () => {
    terminal.writeln('> echo [string]');
    terminal.writeln('  Writes the string provided in the terminal');
    terminal.newLine();
  });

  addDocumentation(args, 'app', () => {
    terminal.writeln('> app [command]');
    terminal.writeln('  commands: close, restore, minimize');
    terminal.writeln('  Issues supported the command to the application.');
    terminal.newLine();
  });

  addDocumentation(args, 'ls', () => {
    terminal.writeln('> ls [path]');
    terminal.writeln('  Lists the segments in the provided path. If no path');
    terminal.writeln('  is provided the root directory is used. Only provides');
    terminal.writeln('  information for directories that have been loaded.');
    terminal.newLine();
  });
  
  return null;
}