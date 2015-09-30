'use strict'
// based on https://code.google.com/p/adblockforchrome/source/browse/trunk/functions.js
// thanks!

let translate = function(messageID) {
  return chrome.i18n.getMessage(messageID);
};

let localizePage = function() {
  let elements = [].slice.call(document.querySelectorAll('[data-i18n]')); // TODO Array.from was introduced in Chrome 45
  for (let element of elements) {
    let text = element.dataset.i18n;
    // set innerHTML to a translated string
    element.innerHTML = translate(text);
  }
};

// localize page on DOMContentLoad
document.addEventListener('DOMContentLoaded', localizePage);
