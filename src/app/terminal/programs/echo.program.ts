export function echo(terminal, args) {
  return args.join(' ');
};

export const echo_help = {
  command: ['echo', '<string>'],
  discription: [
    'Writes the string provided in the terminal.'
  ]
};