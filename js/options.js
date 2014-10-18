// Saves options (synced)
function saveOptions() {
  // get base URL
  var jira = document.getElementById('jira-url').value;
  chrome.storage.sync.set({
    jiraURL: jira,
  }, function() {
    // Notify user
    var status = document.getElementById('status');
    status.textContent = 'Options were saved!';
    // remove after 500ms
    window.setTimeout(window.close, 500);
  });
}

// Restore the JIRA base url
function restoreOptions() {
  // fallback to empty string
  chrome.storage.sync.get({
    jiraURL: '',
  }, function(options) {
    // set value
    document.getElementById('jira-url').value = options.jiraURL;
  });
}

// Load options on DOMContentLoad
document.addEventListener('DOMContentLoaded', restoreOptions);
// Save options when button is clicked
window.addEventListener('load', function(evt) {
  document.getElementById('save').addEventListener('click', saveOptions);
})
