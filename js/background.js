'use strict';

// opens the given ticket in current or new tab
var openTicket = (ticket, newTab) => {
  chrome.storage.sync.get({
    jiraURL: ''
  }, options => {
    // get saved JIRA URL
    let jiraURL = options.jiraURL;
    let newURL;
    if (!jiraURL) {
      // go to options page
      chrome.runtime.openOptionsPage();
      return;
    } else {
      // make URL
      newURL = jiraURL + ticket;
    }
    chrome.tabs.getSelected(null, tab => {
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

let handleSelectionCurrent = selection => {
  openTicket(selection.selectionText, false);
};

let handleSelectionNew = selection => {
  openTicket(selection.selectionText, true);
};


// right click (context menus)
const contexts = ['selection'];
let context = contexts[0];

let parentId = chrome.contextMenus.create({
  'title': 'Quick JIRA',
  'contexts': [context]
});

let currentTabString = chrome.i18n.getMessage('openInCurrentTab');
chrome.contextMenus.create({
  'title': currentTabString,
  'parentId': parentId,
  'contexts': [context],
  'onclick': handleSelectionCurrent
});

let newTabString = chrome.i18n.getMessage('openInNewTab');
chrome.contextMenus.create({
  'title': newTabString,
  'parentId': parentId,
  'contexts': [context],
  'onclick': handleSelectionNew
});


// listen to omnibox jira
chrome.omnibox.onInputEntered.addListener(text => {
  chrome.storage.sync.get({
    // fallback
    defaultOption: 'current tab'
  }, options => {
    openTicket(text, options.defaultOption !== 'current tab');
  });
});


// Listen to install
chrome.runtime.onInstalled.addListener(details => {
  switch(details.reason) {
    case 'install':
      chrome.runtime.openOptionsPage();
      break;
  }
});
