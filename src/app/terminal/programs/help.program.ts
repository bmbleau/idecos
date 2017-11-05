export function help(terminal, args) {
  terminal.writeln('IDECOS Terminal is not bash, but it does provide some useful');
  terminal.writeln('functionality. Bellow is a list of some of the commands you');
  terminal.writeln('can use.');
  terminal.newLine();
  terminal.writeln('> echo [string]');
  terminal.writeln('  Writes the string provided in the terminal');
  terminal.newLine();
  terminal.writeln('> dispatch [type] [payload]');
  terminal.writeln('  dispatches an event of the given type (arg[0]) to the store');
  terminal.writeln('  with a payload (arg[1]).');
}