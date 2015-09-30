// saves options (synced)
var saveOptions = function(event) {
  // get base URL
  event.preventDefault();
  debugger;
  var status = document.getElementById('status');
  var urlPattern = /^https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}$/;
  var jira = document.getElementById('jira-url').value;
  if (!urlPattern.test(jira)) {
    status.className += ' active';
    status.textContent = chrome.i18n.getMessage('validURL');
  } else {
    var defaultOption = document.getElementById('default-option').value;
    // Map currentTab to 0 and newTab to 1
    if (chrome.i18n.getMessage('currentTab') === defaultOption) {
      defaultOption = 0;
    } else {
      defaultOption = 1;
    }
    chrome.storage.sync.set({
      jiraURL: jira,
      defaultOption: defaultOption
    }, function() {
      // notify user
      status.classList.add('active');
      status.textContent = chrome.i18n.getMessage('savedOptions');
      // remove after 500ms
      window.setTimeout(function() {
        closeTab();
      }, 500);
    });
  }
};

var closeTab = function() {
  chrome.tabs.getCurrent(function(tab) {
    chrome.tabs.remove(tab.id, function() { });
  });
};

// restore the JIRA base url
var restoreOptions = function() {
  document.querySelector('.save').value = chrome.i18n.getMessage('saveOptions');
  // fallback to empty string
  chrome.storage.sync.get({
    jiraURL: '',
    defaultOption: 0
  }, function(options) {
    // set value
    document.getElementById('jira-url').value = options.jiraURL;
    // Map 0 to currentTab and 1 to newTab
    var defaultOption = chrome.i18n.getMessage("currentTab");
    if (options.defaultOption === 1) {
      defaultOption = chrome.i18n.getMessage("newTab");
    }
    document.getElementById('default-option').value = defaultOption;
  });
};

// load options on DOMContentLoad
document.addEventListener('DOMContentLoaded', function(e) {
  restoreOptions();
  document.getElementById('options').addEventListener('submit', function(e) {
    saveOptions(e);
  });
});
