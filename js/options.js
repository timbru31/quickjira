'use strict';

const urlPattern = /^https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}$/;

// saves options (synced)
let saveOptions = event => {
  // get base URL
  event.preventDefault();
  let status = document.querySelector('.quiji-options-status');
  let jira = document.querySelector('.quiji-options-jira-url').value;
  if (!urlPattern.test(jira)) {
    status.textContent = chrome.i18n.getMessage('validURL');
  } else {
    let defaultOption = document.querySelector('select').value;
    // Map currentTab to 0 and newTab to 1
    if (chrome.i18n.getMessage('currentTab') === defaultOption) {
      defaultOption = 0;
    } else {
      defaultOption = 1;
    }
    chrome.storage.sync.set({
      jiraURL: jira,
      defaultOption: defaultOption
    }, () => {
      // notify user
      status.textContent = chrome.i18n.getMessage('savedOptions');
      // remove after 500ms
      window.setTimeout(() => {
        window.close();
      }, 1000);
    });
  }
};

// restore the JIRA base url
let restoreOptions = () => {
  document.querySelector('.quiji-options-save').value = chrome.i18n.getMessage('saveOptions');
  // fallback to empty string
  chrome.storage.sync.get({
    jiraURL: '',
    defaultOption: 0
  }, options => {
    // set value
    document.querySelector('.quiji-options-jira-url').value = options.jiraURL;
    // Map 0 to currentTab and 1 to newTab
    let defaultOption = chrome.i18n.getMessage('currentTab');
    if (options.defaultOption === 1) {
      defaultOption = chrome.i18n.getMessage('newTab');
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
