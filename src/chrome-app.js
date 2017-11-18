chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    'id': 'net.bleauweb.idecos',
    'singleton': true,
    'outerBounds': {
      'width': 1000,
      'height': 600
    }
  });
});