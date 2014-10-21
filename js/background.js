// opens the given ticket in current or new tab
function openTicket(ticket, newTab) {
  chrome.storage.sync.get({
    jiraURL: '',
  }, function(options) {
    // get saved JIRA URL
    var jiraURL = options.jiraURL;
    var newURL;
    if (jiraURL == "") {
      // go to options page
      newURL = "html/options.html";
    } else {
      // make URL
      newURL = jiraURL + ticket;
    }
    chrome.tabs.getSelected(null, function(tab) {
      if (newTab) {
        // open in new tab
        chrome.tabs.create({ url: newURL });
      } else {
        // update current tab
        chrome.tabs.update(tab.id, {
            url: newURL;
        });
      }
    });
  });
}

// listen to omnibox jira
chrome.omnibox.onInputEntered.addListener(function(text) {
  openTicket(text, false);
});
