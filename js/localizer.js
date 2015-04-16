// based on https://code.google.com/p/adblockforchrome/source/browse/trunk/functions.js
// thanks!

// load options on DOMContentLoad
document.addEventListener('DOMContentLoaded', localizePage);

function translate(messageID, args) {
  return chrome.i18n.getMessage(messageID, args);
};

function localizePage() {
  var elements = document.getElementsByTagName('*');
  for (var i = 0, n = elements.length; i < n; i++) {
    if (elements[i].getAttribute("i18n") !== null) {
      var element = elements[i];
      var text = element.getAttribute("i18n");
      // Element exists with attribute. Add to array.
      element.innerHTML = translate(text)
    }
  }
}
