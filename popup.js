function openTicket() {
  event.preventDefault();
  var ticket = encodeURIComponent(document.getElementById('ticket_id').value);
  var newURL = "TODO URL" + ticket;
  var newTab = event.target.newTab;
  chrome.tabs.getSelected(null, function(tab) {
    if (newTab) {
      chrome.tabs.create({ url: newURL });
    } else {
      chrome.tabs.update(tab.id, {
          url: newURL
      });
    }
  });
}

window.addEventListener('load', function(evt) {
  var form = document.getElementById('jira');
  form.addEventListener('submit', openTicket);
  form.newTab = false;

  document.getElementById('current').value = chrome.i18n.getMessage("currentTab");

  var button = document.getElementById('new');
  button.addEventListener('click', openTicket);
  button.newTab = true;
  button.value = chrome.i18n.getMessage("newTab");
});
