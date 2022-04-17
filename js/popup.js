// Chrome and Opera do not support browser. http://stackoverflow.com/a/37646525/1902598
const _browser = this._browser || this.browser || this.chrome;
const storage = _browser.storage.sync || _browser.storage.local;

const handleSubmit = (event) => {
	if (event) {
		event.preventDefault();
	}
	const ticket = encodeURIComponent(document.querySelector('.quiji-ticket-id').value);
	const company = document.querySelector('.company-selector').value
	if (ticket) {
		window.setTimeout(() => window.close(), 1000);
		_browser.extension.getBackgroundPage().openTicket(ticket, event.target.newTab, company);
	}

	storage.set(
		{
			jiraLASTCOMP: company,
		},
		() => {
			//? maybe storing last option should be an option
		}
	);
};

const handleLastTicket = (event, defaultOption, lastTicket) => {
	if (event) {
		event.preventDefault();
	}
	window.setTimeout(() => window.close(), 1000);
	_browser.extension.getBackgroundPage().openTicket(lastTicket, defaultOption);
};

const renderDialog = () => {
	storage.get(
		{
			defaultOption: 0,
			jiraCompanyIds: '',
			jiraLASTCOMP: '',
			lastTicket: '',
		},
		(options) => {
			const form = document.querySelector('.quiji-popup-form');
			const newButton = document.querySelector('.quiji-new-tab');
			newButton.newTab = true;
			const currentButton = document.querySelector('.quiji-current-tab');
			currentButton.newTab = false;

			//render company options
			let allCompanyOptions = document.querySelectorAll('.company-options')
			for (let i = 0; i < allCompanyOptions.length; i++) {
				allCompanyOptions[i].innerHTML = options.jiraCompanyIds[i] || ''
			}

			//on first run, options.jiraLASTCOMP may be null
			if (options.jiraLASTCOMP){
				const jiraCompany = parseInt(options.jiraLASTCOMP)
				document.querySelectorAll('.company-options')[jiraCompany].setAttribute('selected', '')
		    }
			const lastTicketButton = createLastTicketButton(options);

			form.addEventListener('submit', handleSubmit);
			newButton.addEventListener('click', handleSubmit);
			currentButton.addEventListener('click', handleSubmit);

			// depending on the option attach newTab true or false to submit handler
			form.newTab = !options || options.defaultOption === 0 ? false : true;

			newButton.value = _browser.i18n.getMessage('newTab');
			currentButton.value = _browser.i18n.getMessage('currentTab');
			lastTicketButton.value = _browser.i18n.getMessage('lastTicket');

			setTimeout(() => document.querySelector('#quiji-ticket-id').focus(), 0);
		}
	);
};

document.addEventListener('DOMContentLoaded', () => {
	renderDialog();
});

function createLastTicketButton(options) {
	const lastTicketButton = document.querySelector('.quiji-last-ticket');
	if (options) {
		if (!options.lastTicket) {
			lastTicketButton.disabled = true;
		} else {
			lastTicketButton.addEventListener('click', (e) => handleLastTicket(e, options.defaultOption, options.lastTicket));
		}
	}
	return lastTicketButton;
}
