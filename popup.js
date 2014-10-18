function openTicket() {
  event.preventDefault();
  // Clos after success
  window.setTimeout(window.close, 1000);
  chrome.storage.sync.get({
    jiraURL: '',
    // pass if the new tab should be used
    newTab: event.target.newTab
  }, function(options) {
    // get ticket ID
    var ticket = encodeURIComponent(document.getElementById('ticket_id').value);
    // get saved JIRA URL
    var jiraURL = options.jiraURL;
    // make URL
    var newURL = jiraURL + ticket;
    chrome.tabs.getSelected(null, function(tab) {
      if (options.newTab) {
        // open in new tab
        chrome.tabs.create({ url: newURL });
      } else {
        // update current tab
        chrome.tabs.update(tab.id, {
            url: newURL
        });
      }
    });
  });
}

window.addEventListener('load', function(evt) {
  // get form and attach submit listener
  var form = document.getElementById('jira');
  form.addEventListener('submit', openTicket);
  form.newTab = false;

  // get button and attach click listener
  var button = document.getElementById('new');
  button.addEventListener('click', openTicket);
  button.newTab = true;

  // Localization
  button.value = chrome.i18n.getMessage("newTab");
  document.getElementById('current').value = chrome.i18n.getMessage("currentTab");
});
