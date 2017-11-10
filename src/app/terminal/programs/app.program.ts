export function app(terminal, args) {
  const command = args.shift();
  switch (command) {
    case 'close': {
      this.store$.dispatch({
        type: 'window:close',
      });
    }
    case 'minimize': {
      this.store$.dispatch({
        type: 'window:minimize',
      });
    }
    case 'restore': {
      this.store$.dispatch({
        type: 'window:restore',
      });
    }
    case 'dispatch': {
      const type = args.shift();
      const payload = JSON.parse(args.join(' ') || '{}');
      this.store$.dispatch({
        type,
        payload,
      });
    }
  }
  
  return null;
};

export const app_help = {
  command: ['app', '<command>'],
  discription:  [
    'commands: close, restore, minimize, dispatch',
    'Issues supported the command to the application.'
  ],
};