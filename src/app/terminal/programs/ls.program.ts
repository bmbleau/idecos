export function ls(terminal, args) {
  const findEntry = (root, uri) => {
    if (root.fullPath === uri) return root;
    let content;
    if (root.isDirectory) root.contents.forEach(entry => {
      if (uri.includes(entry.fullPath)) {
        content = entry;
      }
    });
    
    return findEntry(content, uri); 
  };

  const directory = this.state &&
                    this.state.editor ?
                    this.state.editor.directory :
                    null;

  if (!directory) return null; 

  const workspace = directory.fullPath;

  let maybeSlash = '';
  if (args[0]) {
    maybeSlash = args[0].split('')[0] === '/' ? '' : '/';
  }
  
  const path = args[0] ? `${workspace}${maybeSlash}${args[0]}` : workspace;
  const _directory = findEntry(directory, path);

  if (_directory && _directory.isDirectory) {
    return _directory.contents.map(entry => entry.name);
  } else {
    return _directory.name;
  }
};

export const ls_help = {
  command: ['ls', '<path>'],
  discription:  [
    'Lists the segments in the provided path. If no path',
    'is provided the root directory is used. Only provides',
    'information for directories that have been loaded.',
  ],
};