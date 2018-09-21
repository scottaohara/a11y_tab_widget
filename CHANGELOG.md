# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]
...

## [2.0.1] - 2018-09-19
### Added
- Use `:focus-visible` and `.focus-visible` class in demonstration page. However this polyfill was not added as a script dependency.
### Fixed
- [Make vertical tablists responsive](https://github.com/scottaohara/a11y_tab_widget/issues/7) update to CSS.

## [2.0.0] - 2018-09-19
### Changed
- Rewrote the entire script from scratch into vanilla JavaScript.
- Revised base markup pattern.
- Allow for external elements to be added to a Tab Widget, generating both the new `tabpanel` and associated `tab`.
- Options for non-default `aria-orientation=vertial` and automatic activation of `tab`s on focus. 


