# Quick JIRA (quiji)
[![Code Climate](https://codeclimate.com/github/timbru31/quickjira/badges/gpa.svg)](https://codeclimate.com/github/timbru31/quickjira)

## Info
Ever wanted to open a JIRA issue really fast in your browser?
Tired of typing the whole address over and over again?
And even more tired of the awesome omnisearch but the need to delete the old ticket id?

If you can answer yes, then this extension is for you!
You can now open up a JIRA issue within a second - in your current or a new tab.

Just configure the "base url" and you are ready to go!
The settings are synced via your Google account across other browsers.

[![Quick JIRA @Chrome Web Store](https://developer.chrome.com/webstore/images/ChromeWebStore_Badge_v2_206x58.png "QuickJIRA @Chrome Web Store")](https://chrome.google.com/webstore/detail/quick-jira/acdnmaeifljongleeegkkfnfcopblokj)
[<img alt="Quick JIRA @Opera add-ons" src="https://dev.opera.com/extensions/branding-guidelines/addons_206x58_en@2x.png" height="58" width="206">](https://addons.opera.com/extensions/details/quick-jira)

## Features
* open issue in current or new tab
* shortcuts
  * Popup (default is CTRL/CMD + Shift + K)
  * Open selected text in the current tab (Alt + K)
  * Open selected text in a new tab (Alt + Shift + K)
* omnibox keyword "jira"
* configure default action
* right click (context menu) integration

## License
This plugin is released under the
*Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)* license.

Please see [LICENSE.md](LICENSE.md) for more information.

## Changelog

**0.7.0**
* Fixed permission for selected text shortcut

**0.6.1**
* Removed deprecated API call
* Added shortcuts to open the selected text as a ticket in the current (Alt + K) or a new tab (Alt + Shift + K)
* Changelog is no longer localized

**0.6**
* Updated to Chrome's new options dialog
* CSS and JS (ES6) updates
* use newer Chrome APIs like runtime.openOptionsPage()
* Minimum Chrome version is now 45

**0.5.1**
* Added support for the QuickSearch URL of JIRA, please refer to the options page for more information. Thanks [@jantimon](https://twitter.com/jantimon) for the hint.

**0.5**
* fixed shortcut (sadly changed to CTRL + SHIFT +K)
* if you experience problems with the new shortcut, please re-install quickjira
* localization updated

**0.4**
* added donation info
* added right click (context menu) options

**0.3.1**
* added link to changelog and options in footer
* new buttons, input fields, overall improved style!

**0.3**
* use Chrome API to close options page
* added welcome page and changelog page
* added footer

**0.2**
* added URL validation
* added omnibox "jira" keyword

**0.1**
* initial release

## Support
For support please create an issue here at GitHub

## Pull Requests
Feel free to submit any PRs here, too. :)

Please indent using two spaces only, have a newline at the EOF and use UNIX line ending, thanks!

## Donation
[![PayPal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif "Donation via PayPal")](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=T9TEV7Q88B9M2)

![BitCoin](https://dl.dropboxusercontent.com/u/26476995/bitcoin_logo.png "Donation via BitCoins")
Address: 1NnrRgdy7CfiYN63vKHiypSi3MSctCP55C
