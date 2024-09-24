/* eslint-disable @typescript-eslint/no-deprecated */

const isFirefox = typeof browser !== 'undefined';
type BrowserType = typeof browser | typeof chrome;

export const _browser: BrowserType = isFirefox ? browser : chrome;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const storage = _browser.storage.sync || _browser.storage.local;

export interface Options {
  jiraURL: string;
  defaultOption: number;
  trimSpaces: number;
}
