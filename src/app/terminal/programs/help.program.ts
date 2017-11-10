import * as programs from './index';

function addDocumentation(args, command, cb) {
  if (!args.length || args.includes(command)) {
    cb();
  }
};

export function help(terminal, args) {
  terminal.writeln('IDECOS Terminal is not bash, but it does provide some useful');
  terminal.writeln('functionality. Bellow is a list of some of the commands you');
  terminal.writeln('can use.');
  terminal.newLine();
  
  Object.keys(programs)
        .filter(program => !program.includes('_help'))
        .forEach(programName => {
          addDocumentation(args, programName, () => {
            const helpInfo = programs[programName + '_help'];
            if (helpInfo) {
              const command = helpInfo.command ? helpInfo.command.join(' ') : '';
              const discription = helpInfo.discription ? helpInfo.discription : '';
              terminal.writeln(`> ${programName}`);
              if (command) terminal.writeln(`  Usage: ${command}`);
              if (discription && Array.isArray(discription)) {
                discription.forEach(line => {
                  terminal.writeln(`  ${line}`);
                });
              } else if (discription) {
                terminal.writeln(`  ${discription}`);
              }
              terminal.newLine();
            }
          });
        });
  
  return null;
};

export const help_help = {
  command: ['help', '<command>'],
  discription: [
    'returns the help documentation for the given command.',
    'If absent of a command it returns all the help docs',
    'for all loaded programs.'
  ],
};