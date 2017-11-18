const queueFiles = ([appWindow, launchAction]) => {
  if ((Array.isArray(launchAction.items)) &&
     (Array.isArray(appWindow.contentWindow.launchQueue))) {
    
    appWindow.contentWindow.addFiles(launchAction.items.map(item => {
      return item.entry;
    }));
  } else if (Array.isArray(launchAction.items)) {
    
    appWindow.contentWindow.launchQueue = launchAction.items.map(item => {
      return item.entry;
    });
  }
};

const createWindow = (launchAction) => {
  // create the window, resolving to both the newly created window
  // and the launch actions.
  return new Promise((resolve, reject) => {
    chrome.app.window.create('index.html', {
      id: 'idecos',
      singleton: true,
      outerBounds: {
        'width': 1000,
        'height': 600
      },
    }, resolve.bind(this));
  })
  .then(createdWindow => {
    // attach the launch actions to the promise chain.
    return [createdWindow, launchAction];
  });
};

chrome.app.runtime.onLaunched.addListener((launchAction) => {
  createWindow(launchAction)
    .then(queueFiles.bind(this));
});