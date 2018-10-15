// Chrome and Opera do not support browser. http://stackoverflow.com/a/37646525/1902598
const translate = (messageID: string) => {
	// tslint:disable-next-line:variable-name
	const __browser = chrome || browser;
	return __browser.i18n.getMessage(messageID);
};

const localizePage = () => {
	const elements = Array.from(document.querySelectorAll('[data-i18n]')) as HTMLElement[];
	for (const element of elements) {
		const text = element.dataset.i18n!;
		element.textContent = translate(text);
	}
};

document.addEventListener('DOMContentLoaded', localizePage);
