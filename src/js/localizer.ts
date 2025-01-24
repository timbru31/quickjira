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
    const i18nAttr = element.getAttribute('data-i18n');
    if (i18nAttr) {
      const match = /\[(.*?)\](.*)/.exec(i18nAttr);
      if (match) {
        // Case 1: Attribute-specific translation
        const [attr, key] = match.slice(1);
        const translatedText = translate(key);
        if (attr === 'textContent') {
          element.textContent = translatedText;
        } else {
          element.setAttribute(attr, translatedText);
        }
      } else {
        // Case 2: Simple textContent replacement
        element.textContent = translate(i18nAttr);
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', localizePage);
