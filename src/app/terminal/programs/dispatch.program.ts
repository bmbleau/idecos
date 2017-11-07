export function dispatch(terminal, args) {
  const type = args.shift();
  const payload = JSON.parse(args.join(' ') || '{}');
  this.store$.dispatch({
    type,
    payload
  });
  
  return null;
}