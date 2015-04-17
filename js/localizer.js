// based on https://code.google.com/p/adblockforchrome/source/browse/trunk/functions.js
// thanks!

translate = function(messageID) {
  return chrome.i18n.getMessage(messageID);
}

localizePage = function() {
  var elements = document.querySelectorAll("[i18n]")
  for (var i = 0, n = elements.length; i < n; i++) {
    var element = elements[i];
    var text = element.getAttribute("i18n");
    // set innerHTML to a translated string
    element.innerHTML = translate(text)
  }
}

// localize page on DOMContentLoad
document.addEventListener('DOMContentLoaded', localizePage);
