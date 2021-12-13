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
    <h# data-atabs-heading>
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

### Injecting content into the Tab Widget
Once a new instance of a Tab Widget has been created, the `addTab` function can be called from outside the script.  Using this function, you can reference elements in the DOM (by `id`) that are not in the `data-atabs` wrapping element, and move them into the Tab Widget, creating a `tab` and `tabpanel` for the content. This may be useful if you need to create a Tab Widget, but you may not have full control over the HTML of your document.

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

### Tab Widget attributes & options
The Tab Widget script runs through the markup looking for specific `data-atabs-*` attributes to use as hooks to modify the original markup and generate the final component.  Here are the `data` attributes that are recognized by this script.

* `data-atabs`  
  The primary hook. This necessary attribute is used to contain the final Tab Widget.  
* `data-atabs-panel`    
  Designates that an element should serve as a `tabpanel`. If given the value of "default", the script will set this `tabpanel` and associated `tab` to be active, instead of automatically  first `tab` and `tabpanel`.  If multiple `data-atabs-panel` attributes have the value of "default", only the first one will be respected.
* `data-atabs-tab-label`   
  Also used on the element that will be a `tabpanel`, this attribute indicates that the generated `tab` should use its value as the `tab`'s label. The value of `data-atabs-tab-label` takes precedents over using the content of the `tabpanel`'s heading when generating the `tab`.
* `data-atabs-heading`   
  Place this attribute on the element that serves as the heading within the `tabpanel`. Unless a `data-atabs-tab-label` is used on the `tabpanel`, this heading will serve as the accessible name for the generated `tab`.  By default, elements with the `data-atabs-heading` attribute will be removed after their content has been used for the generated `tab`, unless the value of "keep" is set, e.g. `data-atabs-heading="keep`. Only the first instance of an element with this attribute will be recognized by the script.
* `data-atabs-toc`  
  Without JavaScript, a table of contents (TOC) can provide easy access to different sections of a document that would have otherwise been part of the Tab Widget. With JavaScript available, the TOC isn't as necessary. Providing this attribute with the `id` of the TOC parent element will remove the TOC from the DOM.
* `data-atabs-manual`  
  By default, when keyboard focus is set to a `tab`, its associated `tabpanel` will open by default, and the `tab` will be set to the selected state. 

  If this attribute is set to the `data-atabs` wrapper of *any* Tab Widget in a document, it will make **all** Tab Widgets require manual activation of a `tab` to reveal its associated `tabpanel`.  The reason this globally affects Tab Widgets is to mitigate any possibility of an inconsistent user experience between different Tab Widgets in the same document.  
* `data-atabs-orientation`  
  If this attribute is set to the `data-atabs` wrapper element, and it's value is set to "vertical", then it will add `aria-orientation="vertical"` to the `tablist`. As `aria-orientation` is not well supported across all screen readers, this does not presently have any effect on the current functionality of the Tab Widget.
* `data-atabs-panel-wrap`
  Optional: use this attribute on a wrapping element for all of the `tabpanel`s. Useful for styling a single wrapper for each `tabpanel`.

## User Experience
Tab Widgets are a type of show/hide component, and the manner in which you interact with a Tab Widget will dictate the experience.

For mouse and touch users, the show/hide functionality is initiated by interacting with the `tab`s within the `tablist`.  Activating a `tab` will reveal the `tabpanel` its associated with, while also deactivating the previously active `tab`, and hiding its `tabpanel`.

For keyboard users, and screen reader users in forms mode, a Tab Widget will automatically select and reveal the contents of the focused `tab` as a user navigates the `tablist` with arrow keys.  

A option is available (`data-atabs-manual`) to require manual activation of `tab`s. This is not necessarily preferred behavior of a Tab Widget, but there may be instances where it's required due to performance issues.

The [ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.2/#tabpanel) notes:
>It is recommended that tabs activate automatically when they receive focus as long as their associated tab panels are displayed without noticeable latency. This typically requires tab panel content to be preloaded. Otherwise, automatic activation slows focus movement, which significantly hampers users' ability to navigate efficiently across the tab list.  

This script has been tested to work with mouse, touch, and keyboard devices. Each input device has also been re-tested while running various browser and screen reader pairings.

**FYI: More information concerning expected functionality and screen reader announcements will be linked to from here.**

## Dependencies and known issues
There are no dependencies for this script. Any necessary polyfill (for IE11) is included in the JavaScript.  

There are some issues with how screen readers interact with Tab Widgets. 
* [NVDA: Unexpected focusing of inactive `tab`s in `tablist`](https://github.com/nvaccess/nvda/issues/8906)  
* [JAWS: Unexpected focusing of inactive `tab`s in `tablist`](https://github.com/FreedomScientific/VFO-standards-support/issues/132)
* JAWS + Windows 7 Firefox:  
  Navigating out of a `tablist` by use of <kbd>Tab</kbd> key, focus will be moved to the exposed `tabpanel`. JAWS will not leave forms mode as expected, and will require that the user do so manually to navigate the contents of the `tabpanel`.


## Additional Reading
* [ARIA Specification: Tab Role](https://www.w3.org/TR/wai-aria-1.2/#tab)
* [ARIA Specification: Tablist Role](https://www.w3.org/TR/wai-aria-1.2/#tablist)
* [Aria Specification: Tabpanel Role](https://www.w3.org/TR/wai-aria-1.2/#tabpanel)
* [WAI-ARIA Authoring Practices: Tab Widgets](https://www.w3.org/TR/wai-aria-practices-1.2/#tabpanel)


## License, Thank yous & Such
This script was written by Scott O'Hara: [Website](https://www.scottohara.me), [Twitter](https://twitter.com/scottohara).

It has an [MIT](https://github.com/scottaohara/accessible-components/blob/master/LICENSE.md) license.

Special thanks to [Josh Drumm](https://github.com/wwnjp) and [Chris Ferdinandi](https://gomakethings.com/) for helping me with some JavaScript refactoring and helper functions.

Thanks to [Léonie Watson](https://tink.uk/), Adam Campfield, Ryan Adams, and many others who provided excellent user feedback.

Use it, modify it, contribute to it to help make your project more accessible :)
