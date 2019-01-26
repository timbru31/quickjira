// Chrome and Opera do not support browser. http://stackoverflow.com/a/37646525/1902598
const translate = messageID => {
	const _browser = this._browser || this.browser || this.chrome;
	return _browser.i18n.getMessage(messageID);
};

const localizePage = () => {
	const elements = Array.from(document.querySelectorAll('[data-i18n]'));
	for (const element of elements) {
		const text = element.dataset.i18n;
		element.textContent = translate(text);
	}
};

document.addEventListener('DOMContentLoaded', localizePage);
