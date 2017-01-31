'use strict';

// Opera does not support browser. http://stackoverflow.com/a/37646525/1902598
const _browser = this.browser || this.chrome;
const storage = _browser.storage.sync || _browser.storage.local;

const handleSubmit = (event) => {
  if (event) {
    event.preventDefault();
  }
  // get ticket
  const ticket = encodeURIComponent(document.querySelector('.quiji-ticket-id').value);
  // call the background method
  if (ticket) {
    // close after success
    window.setTimeout(window.close, 1000);
    _browser.extension.getBackgroundPage().openTicket(ticket, event.target.newTab);
  }
};

const handleLastTicket = (event, defaultOption, lastTicket) => {
  event.preventDefault();
  // close after success
  window.setTimeout(window.close, 1000);
  _browser.extension.getBackgroundPage().openTicket(lastTicket, defaultOption);
};

const renderDialog = () => {
  storage.get({
    // fallback
    defaultOption: 0,
    lastTicket: ''
  }, options => {
    // get form
    const form = document.querySelector('.quiji-popup-form');
    // get buttons
    const newButton = document.querySelector('.quiji-new-tab');
    newButton.newTab = true;
    const currentButton = document.querySelector('.quiji-current-tab');
    currentButton.newTab = false;

    const lastTicketButton = document.querySelector('.quiji-last-ticket');
    if (options) {
      if (!options.lastTicket) {
        lastTicketButton.disabled = true;
      } else {
        lastTicketButton.addEventListener('click', e => handleLastTicket(e, options.defaultOption, options.lastTicket));
      }
    }

    // attach click and submit listener
    form.addEventListener('submit', handleSubmit);
    newButton.addEventListener('click', handleSubmit);
    currentButton.addEventListener('click', handleSubmit);

    // depending on the option attach newTab true or false to submit handler
    form.newTab = !options || options.defaultOption === 0 ? false : true;

    // localization
    newButton.value = _browser.i18n.getMessage('newTab');
    currentButton.value = _browser.i18n.getMessage('currentTab');
    lastTicketButton.value = _browser.i18n.getMessage('lastTicket');

    // Firefox has no autofocus, set it manually
    setTimeout(() => document.querySelector('#quiji-ticket-id').focus(), 0);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  renderDialog();
});
