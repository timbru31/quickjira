'use strict';

// Opera does not support browser. http://stackoverflow.com/a/37646525/1902598
const browser = browser || chrome;
const storage = browser.storage.sync || browser.storage.local;

// opens the given ticket in current or new tab
var openTicket = (ticket, newTab) => {
  storage.set({
    lastTicket: ticket
  });

  storage.get({
    jiraURL: ''
  }, options => {
    // get saved JIRA URL
    const jiraURL = options && options.jiraURL;
    let newURL;
    if (!jiraURL) {
      // go to options page
      browser.runtime.openOptionsPage();
      return;
    } else {
      // make URL
      newURL = jiraURL + ticket;
    }

    browser.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (newTab) {
        // open in new tab
        browser.tabs.create({ url: newURL });
      } else {
        // update current tab
        browser.tabs.update(tabs[0].id, {
          url: newURL
        });
      }
    });
  });
};

const handleSelectionCurrent = selection => {
  openTicket(selection.selectionText, false);
};

const handleSelectionNew = selection => {
  openTicket(selection.selectionText, true);
};

const parentId = browser.contextMenus.create({
  'title': 'Quick JIRA',
  'contexts': ['selection']
});

const currentTabString = browser.i18n.getMessage('openInCurrentTab');
browser.contextMenus.create({
  'title': currentTabString,
  'parentId': parentId,
  'contexts': ['selection'],
  'onclick': handleSelectionCurrent
});

const newTabString = browser.i18n.getMessage('openInNewTab');
browser.contextMenus.create({
  'title': newTabString,
  'parentId': parentId,
  'contexts': ['selection'],
  'onclick': handleSelectionNew
});

// listen to omnibox jira, if supported
if (browser.omnibox) {
  browser.omnibox.onInputEntered.addListener(text => {
    storage.get({
      // fallback
      defaultOption: 0
    }, options => {
      openTicket(text, options.defaultOption !== 0);
    });
  });
}

const funcToInject = () => {
  const selection = window.getSelection();
  return (selection.rangeCount > 0) ? selection.toString() : '';
};

const jsCodeStr = `;(${funcToInject})();`;

// Listen to commands
browser.commands.onCommand.addListener((cmd) => {
  browser.tabs.executeScript({
    code: jsCodeStr,
    allFrames: true
  }, selectedTextPerFrame => {
    if (!browser.runtime.lastError && ((selectedTextPerFrame.length > 0) && (typeof (selectedTextPerFrame[0]) === 'string'))) {
      const selectedText = selectedTextPerFrame[0];
      if (cmd === 'open-ticket-in-current-tab') {
        openTicket(selectedText, false);
      } else if (cmd === 'open-ticket-in-new-tab') {
        openTicket(selectedText, true);
      }
    }
  });
});

// Listen to install
browser.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    browser.runtime.openOptionsPage();
  }
});
