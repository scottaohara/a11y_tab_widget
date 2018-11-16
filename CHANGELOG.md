# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]
- [Removable `tab`/`tabpanel` functionality](https://github.com/scottaohara/a11y_tab_widget/issues/6).
- [Open a `tabpanel` from URL hash](https://github.com/scottaohara/a11y_tab_widget/issues/8).

## [2.1.0] - 2018-11-15
### Fixed
- [Finished version documentation](https://github.com/scottaohara/a11y_tab_widget/issues/10)
- [Support for IE11](https://github.com/scottaohara/a11y_tab_widget/issues/9)
- Missing `role=tabpanel` on panels.  Oops.

### Added
- Updated (finished) documentation for new 2.x version of this script.
- Various example/test files.
- [Work around for NVDA + JAWS focus bug](https://github.com/scottaohara/a11y_tab_widget/commit/7bda439de03d09c2a472a6ee5d95c2a4b663d679). [NVDA filed bug](https://github.com/nvaccess/nvda/issues/8906), [JAWS filed bug](https://github.com/FreedomScientific/VFO-standards-support).

### Changed
- `tabpanel`s can only receive keyboard focus on initial <kbd>Tab</kbd> away from the `tablist`. Once the `tabpanel` loses focus, the `tabindex` is removed. `tabpanel`s no longer behave as 'clickable' elements when navigating by touch.
- Up, down, left, and right arrow keys all work to navigate between `tab`s within a `tablist`, regardless of orientation. This is due to the fact that `aria-orientation` has poor support and user feedback all requested this feature.
- Change Delete keycode to "delete" and not "Backspace" key (for future release).
- Generate `span`s instead of `button`s.  Add in functionality for <kbd>Space</kbd> and <kbd>Enter</kbd> keys.  This was to attempt to fix strange behavior that didn't actually have anything to do with the `button`s... but since `button`s !== `tab`s, no real reason to change back...
- `aria-controls` is dynamically added to only the active `tab` so that JAWS won't announce key commands to move to an element that is inaccessible, if virtual cursor is on inactive `tab`s.

### Removed
- `:focus-visible` and `.focus-visible` classes. Not really necessary after various updates to the script since the previous release.


## [2.0.1] - 2018-09-20
### Added
- Use `:focus-visible` and `.focus-visible` class in demonstration page. However this polyfill was not added as a script dependency.
### Fixed
- [Make vertical tablists responsive](https://github.com/scottaohara/a11y_tab_widget/issues/7) update to CSS.

## [2.0.0] - 2018-09-19
### Changed
- Rewrote the entire script from scratch into vanilla JavaScript.
- Revised base markup pattern.
- Revised CSS classes.
- Allow for external elements to be added to a Tab Widget, generating both the new `tabpanel` and associated `tab`.
- Options for non-default `aria-orientation=vertial` and automatic activation of `tab`s on focus. 
### Removed
- Non-ARIA Tab Widget version.


## [1.0.0] - 2015-09-30 to [1.1.1] - 2016-12-19
1.0.0 to 1.1.1 were a jQuery based version of Tab Widgets.  
This series of versions allowed for ARIA vs non-ARIA versions of the Tab Widget.

This version of the script also called for a different version of the expected baseline markup, and hooks to make the script work.  


