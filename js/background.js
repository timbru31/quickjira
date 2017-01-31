'use strict';

// Opera does not support browser. http://stackoverflow.com/a/37646525/1902598
const _browser = this.browser || this.chrome;
const storage = _browser.storage.sync || _browser.storage.local;

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
      try {
        _browser.runtime.openOptionsPage();
      } catch (e) {
        // Edge issue. https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/9929926/
        const optionsPage = _browser.runtime.getManifest()["options_page"];
        const optionsPageUrl = _browser.runtime.getURL(optionsPage);
        _browser.tabs.query({ active: true, currentWindow: true }, () => {
          _browser.tabs.create({ url: optionsPageUrl });
        });
      }
      return;
    } else {
      // make URL
      newURL = jiraURL + ticket;
    }

    _browser.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (newTab) {
        // open in new tab
        _browser.tabs.create({ url: newURL });
      } else {
        // update current tab
        _browser.tabs.update(tabs[0].id, {
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

const parentId = _browser.contextMenus.create({
  'title': 'Quick JIRA',
  'contexts': ['selection']
});

const currentTabString = _browser.i18n.getMessage('openInCurrentTab');
_browser.contextMenus.create({
  'title': currentTabString,
  'parentId': parentId,
  'contexts': ['selection'],
  'onclick': handleSelectionCurrent
});

const newTabString = _browser.i18n.getMessage('openInNewTab');
_browser.contextMenus.create({
  'title': newTabString,
  'parentId': parentId,
  'contexts': ['selection'],
  'onclick': handleSelectionNew
});

// listen to omnibox jira, if supported
if (_browser.omnibox) {
  _browser.omnibox.onInputEntered.addListener(text => {
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
_browser.commands.onCommand.addListener((cmd) => {
  _browser.tabs.executeScript({
    code: jsCodeStr,
    allFrames: true
  }, selectedTextPerFrame => {
    if (!_browser.runtime.lastError && ((selectedTextPerFrame.length > 0) && (typeof (selectedTextPerFrame[0]) === 'string'))) {
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
_browser.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    try {
      _browser.runtime.openOptionsPage();
    } catch (e) {
      // Edge issue. https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/9929926/
      const optionsPage = _browser.runtime.getManifest()["options_page"];
      const optionsPageUrl = _browser.runtime.getURL(optionsPage);
      _browser.tabs.query({ active: true, currentWindow: true }, () => {
        _browser.tabs.create({ url: optionsPageUrl });
      });
    }
  }
});
