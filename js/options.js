// Chrome and Opera do not support browser. http://stackoverflow.com/a/37646525/1902598
const _browser = this._browser || this.browser || this.chrome;
const urlPattern = /^https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}$/;
const storage = _browser.storage.sync || _browser.storage.local;

const saveOptions = (event) => {
	event.preventDefault();
	const status = document.querySelector('.quiji-options-status');
	const jira = document.querySelectorAll('.quiji-options-jira-url');
	const jiraCompanies = document.querySelectorAll('.company-id');

	let invalidUrl = false
	for (const urls of jira) {
		if (!urlPattern.test(urls.value)) {
			invalidUrl = true
		}
	}
	if (invalidUrl) {
		status.textContent = _browser.i18n.getMessage('validURL');
	} else {
		let defaultOption = document.querySelector('select').value;
		// Map currentTab to 0 and newTab to 1
		if (_browser.i18n.getMessage('currentTab') === defaultOption) {
			defaultOption = 0;
		} else {
			defaultOption = 1;
		}

		const trimSpaces = document.querySelector('#trim-spaces').checked ? 1 : 0;

		let allJira = []
		let allJiraCompanies = []
		for (let i = 0; i < jira.length; i++) {
			allJira.push(jira[i].value)
			allJiraCompanies.push(jiraCompanies[i].value)
		}

		storage.set(
			{
				jiraURL: allJira,
				jiraCompanyIds: allJiraCompanies,
				defaultOption,
				trimSpaces,
			},
			() => {
				status.textContent = _browser.i18n.getMessage('savedOptions');
				window.setTimeout(() => {
					window.close();
				}, 1000);
			}
		);
	}
};

const restoreOptions = () => {
	document.querySelector('.quiji-options-save').value = _browser.i18n.getMessage('saveOptions');
	storage.get(
		{
			jiraURL: '',
			jiraCompanyIds: '',
			defaultOption: 0,
			trimSpaces: 0,
		},
		(options) => {
			//for each load options here. 
			let allJiraLinks = options.jiraURL
			let allLinkNodes = document.querySelectorAll('.quiji-options-jira-url')
			let allCompanyNodes = document.querySelectorAll('.company-id')
			for (let i = 0; i < allJiraLinks.length; i++) {
				allLinkNodes[i].value = allJiraLinks[i] || ''
				allCompanyNodes[i].value = options.jiraCompanyIds[i] || ''
			}
			// Map 0 to currentTab and 1 to newTab
			let defaultOption = _browser.i18n.getMessage('currentTab');
			if (options && options.defaultOption === 1) {
				defaultOption = _browser.i18n.getMessage('newTab');
			}
			document.querySelector('select').value = defaultOption;

			document.querySelector('#trim-spaces').checked = options && options.trimSpaces === 1 ? true : false;
		}
	);
};

const createDefaultShortcuts = (shortcutList) => {
	let listItem = document.createElement('li');
	listItem.textContent = 'Popup: Ctrl+Shift+K';
	shortcutList.appendChild(listItem);
	listItem = document.createElement('li');
	listItem.textContent = `${_browser.i18n.getMessage('openInNewTab')}: Alt+Shift+K`;
	shortcutList.appendChild(listItem);
	listItem = document.createElement('li');
	listItem.textContent = `${_browser.i18n.getMessage('openInCurrentTab')}: Alt+K`;
	shortcutList.appendChild(listItem);
};

const loadShortcuts = () => {
	const shortcutList = document.querySelector('.quiji-shortcuts');
	if (!_browser.commands) {
		createDefaultShortcuts(shortcutList);
	} else {
		_browser.commands.getAll((commands) => {
			commands.map((command) => {
				const listItem = document.createElement('li');
				switch (command.name) {
					case '_execute_browser_action':
						listItem.textContent = `Popup: ${command.shortcut || 'Ctrl+Shift+K'}`;
						break;
					case 'open-ticket-in-new-tab':
						listItem.textContent = `${_browser.i18n.getMessage('openInNewTab')}: ${command.shortcut || 'Alt+Shift+K'}`;
						break;
					case 'open-ticket-in-current-tab':
						listItem.textContent = `${_browser.i18n.getMessage('openInCurrentTab')}: ${command.shortcut || 'Alt+K'}`;
						break;
				}
				shortcutList.appendChild(listItem);
			});
		});
	}
};

document.addEventListener('DOMContentLoaded', () => {
	restoreOptions();
	loadShortcuts();
	document.querySelector('.quiji-options').addEventListener('submit', (e) => {
		saveOptions(e);
	});
});
