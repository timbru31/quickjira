'use strict';

// Chrome and Opera do not support browser. http://stackoverflow.com/a/37646525/1902598
const _browser = this.browser || this.chrome;
const storage = _browser.storage.sync || _browser.storage.local;

var openTicket = (ticket, newTab) => {
  storage.set({
    lastTicket: ticket
  });

  storage.get({
    jiraURL: ''
  }, options => {
    const jiraURL = options && options.jiraURL;
    let newURL;
    if (!jiraURL) {
      try {
        _browser.runtime.openOptionsPage();
      } catch (e) {
        // Edge issue. https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/9929926/
        const optionsPage = _browser.runtime.getManifest()['options_page'];
        const optionsPageUrl = _browser.runtime.getURL(optionsPage);
        _browser.tabs.query({ active: true, currentWindow: true }, () => {
          _browser.tabs.create({ url: optionsPageUrl });
        });
      }
      return;
    } else {
      newURL = jiraURL + ticket;
    }

    _browser.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (newTab) {
        _browser.tabs.create({ url: newURL });
      } else {
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

if (_browser.contextMenus) {
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
}

if (_browser.omnibox) {
  _browser.omnibox.onInputEntered.addListener(text => {
    storage.get({
      // fallback
      defaultOption: 0
    }, options => {
      const newTab = options && options.defaultOption !== 0 || false;
      openTicket(text, newTab);
    });
  });
}

const funcToInject = () => {
  const selection = window.getSelection();
  return (selection.rangeCount > 0) ? selection.toString() : '';
};

const jsCodeStr = `;(${funcToInject})();`;

if (_browser.commands) {
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
}

if (_browser.runtime && _browser.runtime.onInstalled) {
  _browser.runtime.onInstalled.addListener(details => {
    if (details.reason === 'install') {
      try {
        _browser.runtime.openOptionsPage();
      } catch (e) {
        // Edge issue. https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/9929926/
        const optionsPage = _browser.runtime.getManifest()['options_page'];
        const optionsPageUrl = _browser.runtime.getURL(optionsPage);
        _browser.tabs.query({ active: true, currentWindow: true }, () => {
          _browser.tabs.create({ url: optionsPageUrl });
        });
      }
    }
  });
}
