export function app(terminal, args) {
  switch (args[0]) {
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
  }
  
  return null;
}