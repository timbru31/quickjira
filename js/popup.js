'use strict';

let handleSubmit = () => {
  event.preventDefault();
  // close after success
  window.setTimeout(window.close, 1000);
  // get ticket
  let ticket = encodeURIComponent(document.querySelector('.quiji-ticket-id').value);
  // call the background method
  chrome.extension.getBackgroundPage().openTicket(ticket, event.target.newTab);
};

let renderDialog = () => {
  chrome.storage.sync.get({
    // fallback
    defaultOption: 'current tab'
  }, options => {
    // get form
    let form = document.querySelector('.quiji-popup-form');
    // get buttons
    let newButton = document.querySelector('.quiji-new-tab');
    newButton.newTab = true;
    let currentButton = document.querySelector('.quiji-current-tab');
    currentButton.newTab = false;

    // attach click and submit listener
    form.addEventListener('submit', handleSubmit);
    newButton.addEventListener('click', handleSubmit);
    currentButton.addEventListener('click', handleSubmit);

    // depending on the option attach newTab true or false to submit handler
    form.newTab = options.defaultOption === 0 ? false : true;

    // localization
    newButton.value = chrome.i18n.getMessage('newTab');
    currentButton.value = chrome.i18n.getMessage('currentTab');
  });
};

document.addEventListener('DOMContentLoaded', () => { renderDialog(); });
