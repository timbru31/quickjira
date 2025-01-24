import { _browser, Options, storage } from './helper.js';

// Save options function
const saveOptions = async (event: Event) => {
  event.preventDefault();

  const jiraInput = document.querySelector<HTMLInputElement>('.quiji-options-jira-url');

  if (jiraInput) {
    // Check for null before accessing properties
    const jira = jiraInput.value;

    const selectElement = document.querySelector<HTMLSelectElement>('select');

    if (selectElement) {
      let defaultOption = selectElement.value;

      // Map currentTab to 0 and newTab to 1
      if (_browser.i18n.getMessage('currentTab') === defaultOption) {
        defaultOption = '0';
      } else {
        defaultOption = '1';
      }

      const trimSpacesCheckbox = document.querySelector<HTMLInputElement>('#trim-spaces');
      const trimSpaces = trimSpacesCheckbox?.checked ? 1 : 0; // Check for null

      await storage.set(
        {
          jiraURL: jira,
          defaultOption: parseInt(defaultOption), // Ensure defaultOption is a number
          trimSpaces,
        },
        () => {
          window.setTimeout(() => {
            window.close();
          }, 1000);
        },
      );
    }
  }
};

// Restore options function
const restoreOptions = async () => {
  const saveButton = document.querySelector<HTMLButtonElement>('.quiji-options-save');
  if (saveButton) {
    saveButton.value = _browser.i18n.getMessage('saveOptions');
  }

  await storage.get(
    {
      jiraURL: '',
      defaultOption: 0,
      trimSpaces: 0,
    } as Options,
    (options) => {
      // Type the options parameter
      const jiraInput = document.querySelector<HTMLInputElement>('.quiji-options-jira-url');
      if (jiraInput) {
        jiraInput.value = (options as Options).jiraURL || '';
      }

      // Map 0 to currentTab and 1 to newTab
      const selectElement = document.querySelector<HTMLSelectElement>('select');
      if (selectElement) {
        let defaultOption = _browser.i18n.getMessage('currentTab');
        if (options.defaultOption === 1) {
          defaultOption = _browser.i18n.getMessage('newTab');
        }
        selectElement.value = defaultOption;
      }

      const trimSpacesCheckbox = document.querySelector<HTMLInputElement>('#trim-spaces');
      if (trimSpacesCheckbox) {
        trimSpacesCheckbox.checked = options.trimSpaces === 1; // Check for null
      }
    },
  );
};

// Create default shortcuts function
const createDefaultShortcuts = (shortcutList: HTMLElement) => {
  let listItem = document.createElement('li');
  listItem.textContent = 'Popup: Ctrl+Shift+K';
  shortcutList.appendChild(listItem);

  listItem = document.createElement('li');
  listItem.textContent = `${_browser.i18n.getMessage('openInNewTab')}: Alt+Shift+K`;
  shortcutList.appendChild(listItem);

  listItem = document.createElement('li');
  listItem.textContent = `${_browser.i18n.getMessage('openInCurrentTab')}: Alt+K`;
  shortcutList.appendChild(listItem);
};

// Load shortcuts function
const loadShortcuts = async () => {
  const shortcutList = document.querySelector<HTMLElement>('.quiji-shortcuts');
  if (shortcutList) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!_browser.commands) {
      createDefaultShortcuts(shortcutList);
    } else {
      await _browser.commands.getAll((commands: chrome.commands.Command[]) => {
        commands.forEach((command) => {
          const listItem = document.createElement('li');
          switch (command.name) {
            case '_execute_action':
            case '_execute_browser_action':
              listItem.textContent = `Popup: ${command.shortcut ?? 'Ctrl+Shift+K'}`;
              break;
            case 'open-ticket-in-new-tab':
              listItem.textContent = `${_browser.i18n.getMessage('openInNewTab')}: ${command.shortcut ?? 'Alt+Shift+K'}`;
              break;
            case 'open-ticket-in-current-tab':
              listItem.textContent = `${_browser.i18n.getMessage('openInCurrentTab')}: ${command.shortcut ?? 'Alt+K'}`;
              break;
          }
          shortcutList.appendChild(listItem);
        });
      });
    }
  }
};

// Document ready event
document.addEventListener('DOMContentLoaded', () => {
  void restoreOptions();
  void loadShortcuts();
  const optionsForm = document.querySelector<HTMLFormElement>('.quiji-options');
  if (optionsForm) {
    optionsForm.addEventListener('submit', (e) => {
      void saveOptions(e);
    });
  }
});
