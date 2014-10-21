function handleSubmit() {
  event.preventDefault();
  // close after success
  window.setTimeout(window.close, 1000);
  // get ticket
  var ticket = encodeURIComponent(document.getElementById('ticket_id').value);
  // call the background method
  chrome.extension.getBackgroundPage().openTicket(ticket, event.target.newTab);
}

window.addEventListener('load', function(evt) {
  chrome.storage.sync.get({
    // fallback
    defaultOption: 'current tab'
  }, function(options) {
    // get form
    var form = document.getElementById('jira');
    // get buttons
    var newButton = document.getElementById('new');
    newButton.newTab = true;
    var currentButton = document.getElementById('current');
    currentButton.newTab = false;

    // attach click and submit listener
    form.addEventListener('submit', handleSubmit);
    newButton.addEventListener('click', handleSubmit);
    currentButton.addEventListener('click', handleSubmit);

    // depending on the option attach newTab true or false to submit handler
    options.defaultOption == 'current tab' ? form.newTab = false : form.newTab = true;

    // localization
    newButton.value = chrome.i18n.getMessage("newTab");
    currentButton.value = chrome.i18n.getMessage("currentTab");
  });
});
