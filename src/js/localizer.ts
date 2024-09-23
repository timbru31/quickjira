import { _browser } from './helper.js';

const translate = (messageID: string | undefined) => {
  if (!messageID) {
    return '';
  }
  return _browser.i18n.getMessage(messageID);
};

const localizePage = () => {
  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-i18n]'));
  for (const element of elements) {
    const text = element.dataset.i18n;
    element.textContent = translate(text);
  }
};

document.addEventListener('DOMContentLoaded', localizePage);
