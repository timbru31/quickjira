// opens the given ticket in current or new tab
var openTicket = function(ticket, newTab) {
  chrome.storage.sync.get({
    jiraURL: ''
  }, function(options) {
    // get saved JIRA URL
    var jiraURL = options.jiraURL;
    var newURL;
    if (!jiraURL) {
      // go to options page
      //newURL = 'html/options.html';
      chrome.runtime.openOptionsPage(function() {
        debugger;
        document.querySelector('.jira-url').style.border = "1px solid red";
      });
      return;
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
            url: newURL
        });
      }
    });
  });
};

var handleSelectionCurrent = function(selection) {
  openTicket(selection.selectionText, false);
};

var handleSelectionNew = function(selection) {
  openTicket(selection.selectionText, true);
};


// right click (context menus)
var contexts = ['selection'];
var context = contexts[0];

var parentId = chrome.contextMenus.create({
  'title': 'Quick JIRA',
  'contexts': [context]
});

var currentTabString = chrome.i18n.getMessage('openInCurrentTab');
chrome.contextMenus.create({
  'title': currentTabString,
  'parentId': parentId,
  'contexts': [context],
  'onclick': handleSelectionCurrent
});

var newTabString = chrome.i18n.getMessage('openInNewTab');
chrome.contextMenus.create({
  'title': newTabString,
  'parentId': parentId,
  'contexts': [context],
  'onclick': handleSelectionNew
});


// listen to omnibox jira
chrome.omnibox.onInputEntered.addListener(function(text) {
  chrome.storage.sync.get({
    // fallback
    defaultOption: 'current tab'
  }, function(options) {
    openTicket(text, options.defaultOption != 'current tab');
  });
});


// Listen to install
chrome.runtime.onInstalled.addListener(function(details) {
  switch(details.reason) {
    case 'install':
      chrome.runtime.openOptionsPage(function() {alert("ive opened someting")});
      //chrome.tabs.create({ url: 'html/welcome.html' });
      break;
    case 'update':
      console.log("updated");
      chrome.runtime.openOptionsPage();
      break;
  }
});
