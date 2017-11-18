/**
 *  Launch Queue
 * 
 *  Creates a launch queue which stores files the operating system
 *  passes in to be loaded into the IDE. This is nessesary to hold
 *  onto the files while initalizing the application, before angular
 *  has a chance to bootstrap.
 * 
 *  This is only to be used when loaded as a Chrome App, and serves
 *  no purpose when loaded as a PWA.
 */

(function (window) {
  if (!Array.isArray(window.launchQueue)) window.launchQueue = [];
  window.addFiles = (files) => {
    window.launchQueue = window.launchQueue.concat(files);
  };
})(window);