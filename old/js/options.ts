const urlPattern = /^https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}$/;
// tslint:disable-next-line:variable-name
const ___browser = chrome || browser;
// tslint:disable-next-line:variable-name
const _storage = ___browser.storage.sync || ___browser.storage.local;

const saveOptions = event => {
	event.preventDefault();
	const status = document.querySelector('.quiji-options-status');
	const jira = document.querySelector('.quiji-options-jira-url').value;
	if (!urlPattern.test(jira)) {
		status.textContent = ___browser.i18n.getMessage('validURL');
	} else {
		let defaultOption = document.querySelector('select').value;
		// Map currentTab to 0 and newTab to 1
		if (___browser.i18n.getMessage('currentTab') === defaultOption) {
			defaultOption = 0;
		} else {
			defaultOption = 1;
		}
		_storage.set(
			{
				jiraURL: jira,
				defaultOption: defaultOption
			},
			() => {
				status.textContent = ___browser.i18n.getMessage('savedOptions');
				window.setTimeout(() => {
					window.close();
				}, 1000);
			}
		);
	}
};

const restoreOptions = () => {
	document.querySelector('.quiji-options-save').value = ___browser.i18n.getMessage('saveOptions');
	_storage.get(
		{
			jiraURL: '',
			defaultOption: 0
		},
		options => {
			document.querySelector('.quiji-options-jira-url').value = (options && options.jiraURL) || '';
			// Map 0 to currentTab and 1 to newTab
			let defaultOption = ___browser.i18n.getMessage('currentTab');
			if (options && options.defaultOption === 1) {
				defaultOption = ___browser.i18n.getMessage('newTab');
			}
			document.querySelector('select').value = defaultOption;
		}
	);
};

const createDefaultShortcuts = shortcutList => {
	let listItem = document.createElement('li');
	listItem.textContent = 'Popup: Ctrl+Shift+K';
	shortcutList.appendChild(listItem);
	listItem = document.createElement('li');
	listItem.textContent = `${___browser.i18n.getMessage('openInNewTab')}: Alt+Shift+K`;
	shortcutList.appendChild(listItem);
	listItem = document.createElement('li');
	listItem.textContent = `${___browser.i18n.getMessage('openInCurrentTab')}: Alt+K`;
	shortcutList.appendChild(listItem);
};

const loadShortcuts = () => {
	const shortcutList = document.querySelector('.quiji-shortcuts');
	if (!___browser.commands) {
		createDefaultShortcuts(shortcutList);
	} else {
		___browser.commands.getAll(commands => {
			commands.map(command => {
				const listItem = document.createElement('li');
				switch (command.name) {
					case '_execute___browser_action':
						listItem.textContent = `Popup: ${command.shortcut || 'Ctrl+Shift+K'}`;
						break;
					case 'open-ticket-in-new-tab':
						listItem.textContent = `${___browser.i18n.getMessage('openInNewTab')}: ${command.shortcut || 'Alt+Shift+K'}`;
						break;
					case 'open-ticket-in-current-tab':
						listItem.textContent = `${___browser.i18n.getMessage('openInCurrentTab')}: ${command.shortcut || 'Alt+K'}`;
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
	document.querySelector('.quiji-options').addEventListener('submit', e => {
		saveOptions(e);
	});
});
