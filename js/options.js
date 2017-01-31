'use strict';

// Opera does not support browser. http://stackoverflow.com/a/37646525/1902598
const _browser = browser || chrome;
const urlPattern = /^https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}$/;
const storage = _browser.storage.sync || _browser.storage.local;

// saves options (synced)
const saveOptions = event => {
  // get base URL
  event.preventDefault();
  const status = document.querySelector('.quiji-options-status');
  const jira = document.querySelector('.quiji-options-jira-url').value;
  if (!urlPattern.test(jira)) {
    status.textContent = _browser.i18n.getMessage('validURL');
  } else {
    let defaultOption = document.querySelector('select').value;
    // Map currentTab to 0 and newTab to 1
    if (_browser.i18n.getMessage('currentTab') === defaultOption) {
      defaultOption = 0;
    } else {
      defaultOption = 1;
    }
    storage.set({
      jiraURL: jira,
      defaultOption: defaultOption
    }, () => {
      // notify user
      status.textContent = _browser.i18n.getMessage('savedOptions');
      // remove after 500ms
      window.setTimeout(() => {
        window.close();
      }, 1000);
    });
  }
};

// restore the JIRA base url
const restoreOptions = () => {
  document.querySelector('.quiji-options-save').value = _browser.i18n.getMessage('saveOptions');
  // fallback to empty string
  storage.get({
    jiraURL: '',
    defaultOption: 0
  }, options => {
    // set value
    document.querySelector('.quiji-options-jira-url').value = options && options.jiraURL;
    // Map 0 to currentTab and 1 to newTab
    let defaultOption = _browser.i18n.getMessage('currentTab');
    if (options && options.defaultOption === 1) {
      defaultOption = _browser.i18n.getMessage('newTab');
    }
    document.querySelector('select').value = defaultOption;
  });
};

// load options on DOMContentLoad
document.addEventListener('DOMContentLoaded', () => {
  restoreOptions();
  document.querySelector('.quiji-options').addEventListener('submit', e => {
    saveOptions(e);
  });
});
