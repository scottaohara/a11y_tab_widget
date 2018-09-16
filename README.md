# Accessible Tabbed Interfaces
A script to progressively enhance sectioned content into an accessible tabbed interface.


## How to use 
To help facilitate the simplest integration with your code base, the required markup is as lean as possible.

### Minimum Setup
```html
<div data-atabs>
  <div data-atabs-panel 
    data-atabs-panel-label="Tab label goes here">
    <!-- all panel content goes here -->
  </div>
  <section data-atabs-panel>
    <h# data-atabs-label>
      <!-- 
        The text/markup injected the panel's 
        associated role="tab" element.
      -->
    </h#>
  </section>
</div>
<!-- ... -->
<script src="index.js"></script>
<script>
  var widget = '[data-atabs]';
  var els = document.querySelectorAll(widget);

  // Generate all tab instances
  for ( var i = 0; i < els.length; i++ ) {
    var nTabs = new ARIAtabs( els[i] );
  }
</script>
```






## User Experience
The manner in which you interact with a Tab Widget is dependent on your input device. Not all devices/assistive applications are listed here, but the following will give you a baseline of expectations if when testing this script, or comparing your own Tab Widget.

### Mouse / Touch
Clicking or tapping a `tab` will set that `tab` to its selected state, and reveal its associated `tabpanel`, while deselecting and hiding the previously selected `tab` and its `tabpanel`.

#### Mouse / Touch + Screen Reader
If using a mouse while also using NVDA with the setting "Report role when mouse enters object", NVDA will announce "Tab. Accessible Name."

If using iOS with VoiceOver enabled, and exploring by touch, a `tab` should announce itself as "Accessible name. Tab. Number of Numbers".  If the touched `tab` is currently active VoiceOver will announce "Selected" prior to the accessible name.



## Additional Reading
* [ARIA Specification: Tab Role](https://www.w3.org/TR/wai-aria-1.2/#tab)
* [ARIA Specification: Tablist Role](https://www.w3.org/TR/wai-aria-1.2/#tablist)
* [Aria Specification: Tabpanel Role](https://www.w3.org/TR/wai-aria-1.2/#tabpanel)
* [WAI-ARIA Authoring Practices: Tab Widgets](https://www.w3.org/TR/wai-aria-practices-1.2/#tabpanel)

## License, Thank yous & Such
This script was written by Scott O'Hara: [Website](https://www.scottohara.me) [Twitter](https://twitter.com/scottohara).

It has an [MIT](https://github.com/scottaohara/accessible-components/blob/master/LICENSE.md) license.

Special thanks to [Josh Drumm](https://github.com/wwnjp) for helping me with some JavaScript refactoring.

Use it, modify it, contribute to it to help make your project more accessible :)
