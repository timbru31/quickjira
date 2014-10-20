function openTicket() {
  event.preventDefault();
  // close after success
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
  chrome.storage.sync.get({
    // fallback
    defaultOption: 'current tab',
  }, function(options) {
    // get form
    var form = document.getElementById('jira');
    // get buttons
    var newButton = document.getElementById('new');
    newButton.newTab = true;
    var currentButton = document.getElementById('current');
    currentButton.newTab = false;

    // Attach click and submit listener
    form.addEventListener('submit', openTicket);
    newButton.addEventListener('click', openTicket);
    currentButton.addEventListener('click', openTicket);

    // Depending on the option attach newTab true or false to submit handler
    console.log(options.defaultOption)
    options.defaultOption == 'current tab' ? form.newTab = false : form.newTab = true;

    // Localization
    newButton.value = chrome.i18n.getMessage("newTab");
    currentButton.value = chrome.i18n.getMessage("currentTab");
  });
});
