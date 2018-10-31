# Accessible Tabbed Interfaces
A script to progressively enhance sectioned content into an accessible tabbed interface.


## How to use 
To help facilitate the simplest integration with your code base, the necessary markup has been boiled down to a wrapping element with a `data-atabs` attribute to serve as the Tab Widget container. Additionally, `tab`s, and `tabpanel`s can be designated via different markup patterns to help suit your needs.

### Example Setup
```html
<div data-atabs> <!-- necessary wrapping element -->
  <!-- Panel method 1 -->
  <div data-atabs-panel 
    data-atabs-tab-label="Tab label goes here">
    <!-- all panel content goes here -->
  </div>

  <!-- Panel method 2 -->
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

  // Generate all Tab Widget instances
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
* `data-atabs-automatic`  
  If this attribute is set to the `data-atabs` wrapper of *any* Tab Widget in a document, it will make **all** Tab Widgets automatically reveal the `tabpanel` associated with the currently focused `tab` element.  The reason this globally affects Tab Widgets is to reduce any possibility of an inconsistent user experience between different Tab Widgets.

  Note that when navigating automatically activated `tab`s with a virtual cursor, whether that be on desktop or mobile, `tabpanel`s will not automatically reveal until a user purposefully activates the virtual cursor focused `tab`.  
* `data-atabs-orientation`  
  If this attribute is set to the `data-atabs` wrapper element, and it's value is set to "vertical", then it will add `aria-orientation="vertical"` to the `tablist` and modify the arrow keys from <kbd>left</kbd> and <kbd>right</kbd> to <kbd>up</kbd> and <kbd>down</kbd> to move focus through the `tab`s within the `tablist`.
* `data-atabs-panel`    
  Designates that an element should serve as a `tabpanel`. If given the value of "default", the script will set this `tabpanel` and associated `tab` to be active, instead of the first `tab` and `tabpanel`.  If multiple `data-atabs-panel` attributes have the value of "default", only the first one will be respected.
* `data-atabs-tab-label`   
  Also used on the element that will be a `tabpanel`, this attribute indicates that the generated `tab` should use its value as the `tab`'s label. The value of `data-atabs-tab-label` takes precedents over using the content of the `tabpanel`'s heading when generating the `tab`.
* `data-atabs-heading`   
  Place this attribute on the element that serves as the heading within the `tabpanel`. Unless a `data-atabs-tab-label` is used on the `tabpanel`, this heading will serve as the accessible name for the generated `tab`.  By default, elements with the `data-atabs-heading` attribute will be removed after their content has been used for the generated `tab`, unless the value of "keep" is set, e.g. `data-atabs-heading="keep`. Only the first instance of an element with this attribute will be recognized by the script.


### Injecting `tabpanel`s into the Tab Widget
Once a new instance of a Tab Widget has been created, the `addTab` function can be called from outside the script.  Using this function, you can point to elements in the DOM that are not wrapped in the `data-atabs` element to inject them into the Tab Widget.

For instance:
```html
<script src="index.js"></script>
<script>
  var tabInstance = '[data-atabs]';
  var els = document.querySelectorAll(tabInstance);
  var injectContent = document.getElementById('inject-content');
  var cloneContent = injectContent.cloneNode(true);
  var allTabs = [];

  // Generate all tab instances
  for ( var i = 0; i < els.length; i++ ) {
    var nTabs = new ARIAtabs( els[i] );

    allTabs.push(nTabs);
  }

  // remove the original instance of the external content from the document.
  injectContent.parentNode.removeChild(injectContent);

  // Inject the external content into a particular
  // tab, captured in the allTabs var.
  allTabs[1].addTab(cloneContent, 'Tab label', 'add-a-class');
</script>
```

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

If a Tab Widget has a `data-atabs-automatic` set to it, then any Tab Widgets in the current document will automatically load the associated `tabpanel` of a `tab` when it receives focus via arrow keys.

### Keyboard + Screen Readers
This section coming soon...

## Dependencies
There are no major dependencies for this script. 

## Additional Reading
* [ARIA Specification: Tab Role](https://www.w3.org/TR/wai-aria-1.2/#tab)
* [ARIA Specification: Tablist Role](https://www.w3.org/TR/wai-aria-1.2/#tablist)
* [Aria Specification: Tabpanel Role](https://www.w3.org/TR/wai-aria-1.2/#tabpanel)
* [WAI-ARIA Authoring Practices: Tab Widgets](https://www.w3.org/TR/wai-aria-practices-1.2/#tabpanel)

## License, Thank yous & Such
This script was written by Scott O'Hara: [Website](https://www.scottohara.me), [Twitter](https://twitter.com/scottohara).

It has an [MIT](https://github.com/scottaohara/accessible-components/blob/master/LICENSE.md) license.

Special thanks to [Josh Drumm](https://github.com/wwnjp) and [Chris Ferdinandi](https://gomakethings.com/) for helping me with some JavaScript refactoring and helper functions.

Use it, modify it, contribute to it to help make your project more accessible :)
