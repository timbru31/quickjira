# Changelog

#### v1.0.0

- Updated extension to manifest v3

#### v0.11.2

- Make space trimming configurable

#### v0.11.1

- Remove spaces from tickets (by [Jesús Roldán](https://github.com/xeBuz))

#### v0.11.0

- Added Spanish translation (by [Jesús Roldán](https://github.com/xeBuz))

#### v0.10.2 (Firefox only)

- Fix issue that prevented the extension to load when commands are unsupported

#### v0.10.0

- Display currently assigned shortcuts on the options page
- Updated logo to reflect the new JIRA logo

#### v0.9.1

- Fix omnibox for Firefox when no URL was configured
- Guard Firefox issue when runtime.onInstalled is not available
- Use textContent over innerHTML for localization

#### v0.9.0

- Update icons displayed in navigation bar
- Various code refactorings to allow usage on Edge and Firefox
- Fallback to local storage if sync is not available

#### v0.8.0

- Add button to open the re-open the last ticket (synced via storage)
- Don't close or submit the popup form when no input is entered
- Fixed omnibox not respecting default setting

#### v0.7.0

- Fixed permission for selected text shortcut

#### v0.6.1

- Removed deprecated API call
- Added shortcuts to open the selected text as a ticket in the current (Alt + K) or a new tab (Alt + Shift + K)
- Changelog is no longer localized

#### v0.6

- Updated to Chrome's new options dialog
- CSS and JS (ES6) updates
- use newer Chrome APIs like runtime.openOptionsPage()
- Minimum Chrome version is now 45

#### v0.5.1

- Added support for the QuickSearch URL of JIRA, please refer to the options page for more information. Thanks [@jantimon](https://twitter.com/jantimon) for the hint.

#### v0.5

- fixed shortcut (sadly changed to CTRL + SHIFT +K)
- if you experience problems with the new shortcut, please re-install quickjira
- localization updated

#### v0.4

- added donation info
- added right click (context menu) options

#### v0.3.1

- added link to changelog and options in footer
- new buttons, input fields, overall improved style!

#### v0.3

- use Chrome API to close options page
- added welcome page and changelog page
- added footer

#### v0.2

- added URL validation
- added omnibox "jira" keyword

#### v0.1

- initial release
