import { _browser, Options, storage } from './helper.js';

interface Message {
  action: string;
  ticket: string;
  newTab: boolean;
}

// Listen for messages from popup
_browser.runtime.onMessage.addListener((message: Message, _sender, _sendResponse) => {
  if (message.action === 'openTicket') {
    const { ticket, newTab } = message;
    void openTicket(ticket, newTab);
  }
});

async function openTicket(ticket: string, newTab: boolean) {
  await storage.get(
    {
      jiraURL: '',
      trimSpaces: 0,
      bitbucketURL: '',
      bitbucketPrefix: '',
    },
    (options) => {
      const jiraURL = (options as Options).jiraURL;
      const bitbucketURL = (options as Options).bitbucketURL;

      let bitbucketPrefix = (options as Options).bitbucketPrefix;
      bitbucketPrefix = encodeURIComponent(bitbucketPrefix);

      const trimSpaces = options.trimSpaces !== 0;
      let newURL: string;

      if (trimSpaces) {
        ticket = decodeURIComponent(ticket).replace(/\s/g, '');
      }

      if (ticket.startsWith(bitbucketPrefix)) {
        console.log('Bitbucket ticket detected');
        if (!bitbucketURL) {
          void _browser.runtime.openOptionsPage();
        } else {
          newURL = ticket.replace(bitbucketPrefix, bitbucketURL);
          void openURLInTab(newTab, newURL);
          return;
        }
      }

      void storage.set({
        lastTicket: ticket,
      });

      if (!jiraURL) {
        void _browser.runtime.openOptionsPage();
      } else {
        newURL = jiraURL + ticket;
        void openURLInTab(newTab, newURL);
      }
    },
  );
}

const handleSelectionCurrent = async (selection: chrome.contextMenus.OnClickData | browser.contextMenus.OnClickData) => {
  if (selection.selectionText) {
    await openTicket(selection.selectionText, false);
  }
};

const handleSelectionNew = async (selection: chrome.contextMenus.OnClickData | browser.contextMenus.OnClickData) => {
  if (selection.selectionText) {
    await openTicket(selection.selectionText, true);
  }
};

// Create the parent context menu item with an explicit id
const parentId = _browser.contextMenus.create({
  id: 'quick-jira-parent',
  title: 'Quick JIRA',
  contexts: ['selection'],
});

const currentTabString = _browser.i18n.getMessage('openInCurrentTab');
_browser.contextMenus.create({
  id: 'quick-jira-current-tab',
  title: currentTabString,
  parentId: parentId,
  contexts: ['selection'],
});

const newTabString = _browser.i18n.getMessage('openInNewTab');
_browser.contextMenus.create({
  id: 'quick-jira-new-tab',
  title: newTabString,
  parentId: parentId,
  contexts: ['selection'],
});

_browser.contextMenus.onClicked.addListener((info, _tab) => {
  if (info.menuItemId === 'quick-jira-current-tab') {
    void handleSelectionCurrent(info);
  }
  if (info.menuItemId === 'quick-jira-new-tab') {
    void handleSelectionNew(info);
  }
});

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (_browser.omnibox) {
  _browser.omnibox.onInputEntered.addListener((text) => {
    void storage.get(
      {
        defaultOption: 0,
      },
      (options) => {
        const newTab = options.defaultOption !== 0 || false;
        void openTicket(text, newTab);
      },
    );
  });
}

_browser.commands.onCommand.addListener((cmd) => {
  // Get the currently active tab
  void _browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const tabId = tabs[0].id;
      if (tabId) {
        _browser.scripting
          .executeScript({
            target: { tabId: tabId, allFrames: true },
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
            func: () => window.getSelection()?.toString() as any,
          })
          .then((selectedTextPerFrame) => {
            if (selectedTextPerFrame.length > 0 && typeof selectedTextPerFrame[0].result === 'string') {
              const selectedText = selectedTextPerFrame[0].result;
              if (cmd === 'open-ticket-in-current-tab') {
                void openTicket(selectedText, false);
              } else if (cmd === 'open-ticket-in-new-tab') {
                void openTicket(selectedText, true);
              }
            }
          })
          .catch((error: unknown) => {
            console.error('Error executing script:', error);
          });
      }
    }
  });
});

_browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    try {
      void _browser.runtime.openOptionsPage();
    } catch {
      const optionsPage = (_browser.runtime.getManifest() as chrome.runtime.Manifest).options_page;
      if (optionsPage) {
        const optionsPageUrl = _browser.runtime.getURL(optionsPage);
        void _browser.tabs.query({ active: true, currentWindow: true }, () => {
          void _browser.tabs.create({ url: optionsPageUrl });
        });
      }
    }
  }
});

async function openURLInTab(newTab: boolean, newURL: string) {
  await _browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (newTab) {
      void _browser.tabs.create({ url: newURL });
    } else if (tabs.length > 0 && tabs[0].id) {
      void (_browser.tabs as typeof chrome.tabs).update(tabs[0].id, {
        url: newURL,
      });
    }
  });
}
