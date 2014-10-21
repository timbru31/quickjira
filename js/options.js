// saves options (synced)
function saveOptions() {
  // get base URL
  event.preventDefault();
  var status = document.getElementById('status');
  var urlPattern = new RegExp("(http|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?");
  var jira = document.getElementById('jira-url').value;
  if (!urlPattern.test(jira)) {
    status.className = "active";
    status.textContent = 'Please specify a valid URL!';
  } else {
    var defaultOption = document.getElementById('default-option').value;
    chrome.storage.sync.set({
      jiraURL: jira,
      defaultOption: defaultOption
    }, function() {
      // notify user
      status.className = "active";
      status.textContent = 'Options were saved!';
      // remove after 500ms
      window.setTimeout(window.close, 500);
    });
  }
}

// restore the JIRA base url
function restoreOptions() {
  // fallback to empty string
  chrome.storage.sync.get({
    jiraURL: '',
    defaultOption: 'current tab'
  }, function(options) {
    // set value
    document.getElementById('jira-url').value = options.jiraURL;
    document.getElementById('default-option').value = options.defaultOption;
  });
}

// load options on DOMContentLoad
document.addEventListener('DOMContentLoaded', restoreOptions);
// save options when button is clicked
window.addEventListener('load', function(evt) {
  document.getElementById('options').addEventListener('submit', saveOptions);
});
