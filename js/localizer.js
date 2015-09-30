'use strict';
// based on https://code.google.com/p/adblockforchrome/source/browse/trunk/functions.js
// thanks!

let translate = messageID => {
  return chrome.i18n.getMessage(messageID);
};

let localizePage = () => {
  let elements = Array.from(document.querySelectorAll('[data-i18n]'));
  for (let element of elements) {
    let text = element.dataset.i18n;
    // set innerHTML to a translated string
    element.innerHTML = translate(text);
  }
};

// localize page on DOMContentLoad
document.addEventListener('DOMContentLoaded', localizePage);
