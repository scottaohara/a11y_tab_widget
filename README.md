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
  <!-- repeat as necessary -->
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



#### `data-atabs` attributes & options
The script runs through the minimum markup looking for specific `data-atabs-*` to use as hooks to modify the original markup and generate the final Tab Widget.

* `data-atabs`  
  The primary hook. This attribute is used to contain the final Tab Widget.
* `data-atabs-toc`  
  Without JavaScript, a table of contents (TOC) can provide easy access to different sections of a document that would have otherwise been part of the Tab Widget. With JavaScript available, the TOC isn't as necessary. Providing this attribute with the `id` of the TOC will remove the TOC from the DOM.
* `data-atabs-panel`  
  Designates that an element should serve as a `tabpanel`. If given the value of "default", the script will set this `tabpanel` and associated `tab` to be active, instead of the first `tab` and `tabpanel`.  If multiple `data-atabs-panel` attributes have the value of "default", only the first one will be respected.
* `data-atabs-panel-label`  
  Also used on the element that will be a `tabpanel`, this attribute indicates that the generated `tab` should use its value as the `tab`'s label. The value of `data-atabs-panel-label` takes precedents over using the content of the `tabpanel`'s heading when generating the `tab`.
* `data-atabs-heading`  


## User Experience
The manner in which you interact with a Tab Widget is dependent on your input device. Not all devices/assistive applications are listed here, but the following will give you a baseline of expectations if when testing this script, or comparing your own Tab Widget.

### Mouse / Touch
Clicking or tapping a `tab` will set that `tab` to its selected state, and reveal its associated `tabpanel`, while deselecting and hiding the previously selected `tab` and its `tabpanel`.

#### Mouse / Touch + Screen Reader
If using a mouse while also using NVDA with the setting "Report role when mouse enters object", NVDA will announce "Tab. Accessible Name."

If using iOS with VoiceOver enabled, and exploring by touch, a `tab` should announce itself as "Accessible name. Tab. Number of Numbers".  If the touched `tab` is currently active VoiceOver will announce "Selected" prior to the accessible name.

### Keyboard
When interacting with a Tab Widget with a desktop or laptop keyboard, one can use the <kbd>Tab</kbd> key to navigate to the `tablist`. Keyboard focus will highlight the `tab` that is currently active.

If the `tablist` is horizontally orientated, using the <kbd>Left</kbd> and <kbd>Right</kbd> arrow keys to will navigate to the previous and next `tab`s in the `tablist`.  Keyboard focus will loop from the last `tab` to the first, and vice versa.  If the `tablist` is vertically oriented, <kbd>Up</kbd> and <kbd>Down</kbd> arrow keys will navigate the `tab`s. Note: vertically oriented `tablist`s should have the attribute `aria-orientation="vertical`.



## Additional Reading
* [ARIA Specification: Tab Role](https://www.w3.org/TR/wai-aria-1.2/#tab)
* [ARIA Specification: Tablist Role](https://www.w3.org/TR/wai-aria-1.2/#tablist)
* [Aria Specification: Tabpanel Role](https://www.w3.org/TR/wai-aria-1.2/#tabpanel)
* [WAI-ARIA Authoring Practices: Tab Widgets](https://www.w3.org/TR/wai-aria-practices-1.2/#tabpanel)

## License, Thank yous & Such
This script was written by Scott O'Hara: [Website](https://www.scottohara.me), [Twitter](https://twitter.com/scottohara).

It has an [MIT](https://github.com/scottaohara/accessible-components/blob/master/LICENSE.md) license.

Special thanks to [Josh Drumm](https://github.com/wwnjp) for helping me with some JavaScript refactoring.

Use it, modify it, contribute to it to help make your project more accessible :)
