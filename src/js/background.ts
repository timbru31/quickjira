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
    },
    (options) => {
      const jiraURL = (options as Options).jiraURL;
      const trimSpaces = options.trimSpaces !== 0;
      let newURL: string;

      if (trimSpaces) {
        ticket = decodeURIComponent(ticket).replace(/\s/g, '');
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

// eslint-disable-next-line @typescript-eslint/no-deprecated
const handleSelectionCurrent = async (selection: chrome.contextMenus.OnClickData | browser.contextMenus.OnClickData) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await openTicket(selection.selectionText!, false);
};

// eslint-disable-next-line @typescript-eslint/no-deprecated
const handleSelectionNew = async (selection: chrome.contextMenus.OnClickData | browser.contextMenus.OnClickData) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await openTicket(selection.selectionText!, true);
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

_browser.commands.onCommand.addListener((cmd) => {
  // Get the currently active tab
  void _browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const tabId = tabs[0].id;
      if (tabId) {
        _browser.scripting
          .executeScript({
            target: { tabId: tabId, allFrames: true },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            func: () => window.getSelection()?.toString(),
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
      // eslint-disable-next-line @typescript-eslint/no-deprecated
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
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      void (_browser.tabs as typeof chrome.tabs).update(tabs[0].id, {
        url: newURL,
      });
    }
  });
}
