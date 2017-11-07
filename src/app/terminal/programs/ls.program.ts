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
                    undefined;

  if (!directory) return null; 

  const path = args[0] ? `${directory.fullPath}/${args[0]}` : directory.fullPath;
  const _directory = findEntry(directory, path);
  

  if (_directory && _directory.isDirectory) {
    return _directory.contents.map(entry => entry.name);
  }
}