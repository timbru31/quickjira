'use strict';
// based on https://code.google.com/p/adblockforchrome/source/browse/trunk/functions.js
// thanks!

// Opera does not support browser. http://stackoverflow.com/a/37646525/1902598
const browser = browser || chrome;
const translate = messageID => {
  return browser.i18n.getMessage(messageID);
};

const localizePage = () => {
  const elements = Array.from(document.querySelectorAll('[data-i18n]'));
  for (const element of elements) {
    const text = element.dataset.i18n;
    // set innerHTML to a translated string
    element.innerHTML = translate(text);
  }
};

// localize page on DOMContentLoad
document.addEventListener('DOMContentLoaded', localizePage);
