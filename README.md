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

  Note that if navigating via the virtual cursor (on desktop or mobile), `tab`s will not auto-activate.  
* `data-atabs-orientation`  
  If this attribute is set to the `data-atabs` wrapper element, and it's value is set to "vertical", then it will add `aria-orientation="vertical"` to the `tablist`. As `aria-orientation` is not well supported across all screen readers, this does not presently have any effect on the current functionality of the Tab Widget.
* `data-atabs-panel`    
  Designates that an element should serve as a `tabpanel`. If given the value of "default", the script will set this `tabpanel` and associated `tab` to be active, instead of automatically  first `tab` and `tabpanel`.  If multiple `data-atabs-panel` attributes have the value of "default", only the first one will be respected.
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
If using a mouse while also using ZoomText Fusion or NVDA with the setting "Report role when mouse enters object", they will announce the element's role (`tab`) and the accessible name.

If using iOS with VoiceOver enabled, and exploring by touch, a `tab` should announce itself as "Accessible name. Tab. Number of Numbers".  If the touched `tab` is currently active VoiceOver will announce "Selected" prior to the accessible name.  A similar experience will occur if exploring by touch with TalkBack and Chrome.  

### Keyboard
When interacting with a Tab Widget with a desktop or laptop keyboard, one can use the <kbd>Tab</kbd> key to navigate to the `tablist`. Keyboard focus will move to the `tab` that is currently active. Pressing the <kbd>Tab</kbd> key again will move keyboard focus to the `tabpanel` itself. The `tabpanel` must be temporarily focusable so as to ensure that keyboard focus doesn't move past a `tabpanel` which doesn't contain any interactive (focusable) child elements. 

When keyboard focus enters the `tablist`, the currently active `tab` should receive focus and skip over any `tab`s that are currently not activated. The <kbd>Left</kbd> &amp; <kbd>Up</kbd> and <kbd>Right</kbd> &amp; <kbd>Down</kbd> arrow keys to will navigate to the previous and next `tab` in the `tablist`, respectively.  Keyboard focus will loop from the last `tab` to the first, and vice versa.  

Note: mapping arrow keys in this manner breaks away a bit from the ARIA specification. This decision was made due to the lack of support for `aria-orientation` across all screen readers / browser pairings. Additionally, this also mitigates odd focus behavior that can occur when all arrow keys aren't accounted for when navigating `tab`s in forms mode. 

<kbd>Home</kbd> and <kbd>End</kbd> should move focus to the first and last `tab`s in a `tablist`, respectively.

If a Tab Widget has a `data-atabs-manual` set to it, then a user must purposefully activate a `tab`, using <kbd>Space</kbd> or <kbd>Enter</kbd> keys, to reveal its associated `tabpanel`.  Otherwise, when a `tab` receives focus, its associated `tabpanel` should become visible, and the previous `tab`'s `tabpanel` should become hidden.


### Keyboard + Screen Readers
When an individual enters a `tablist` and enters Forms Mode, many of the keyboard controls will work as previously outlined.  Where functionality will differ has been outlined per each of the following screen readers.

#### VoiceOver: MacOS
Since VoiceOver doesn't have a forms/application mode, arrow keys will function similarly to default keyboard controls.  Use the <kbd>VO key</kbd> + <kbd>left</kbd> or <kbd>right</kbd> arrow keys to navigate through a `tablist` without setting keyboard focus to a `tab`, until hitting <kbd>VO key</kbd> + <kbd>Space</kbd>.

VoiceOver will expose `tab`s under the Form Controls rotor dialog menu. They can be navigated to like form controls, using <kbd>VO key</kbd> + <kbd>Command</kbd> + <kbd>J</kbd>.

When focusing within a `tablist`, VoiceOver will announce the accessible name of the `tab`, its role, and then the `tab`'s current number followed by the total amount of `tab`s. If the currently focused `tab` is active, the state "selected" will be announced after the accessible name.

For instance:
>"Accessible Name, Selected, Tab, 1 of X."

Note that a `tablist`'s orientation is not announced when using VoiceOver.


#### VoiceOver: iOS
Similarly to VoiceOver on MacOS, VoiceOver will expose `tab`s under the Form Controls rotor setting. When selected swiping up or down will navigate <abbr>VO</abbr> focus to these `tab`s in sequential order. It should be noted that `tab`s are only exposed under the Form Controls setting, and are not navigable if the <abbr>VO</abbr> rotor is set to buttons.

When focusing within a `tablist`, VoiceOver will announce the accessible name of the `tab`, its role, and then the `tab`'s current number followed by the total amount of `tab`s. If the currently focused `tab` is active, the state "selected" will be announced prior to the accessible name.

For instance:
>"Selected, Accessible Name, Tab 1 of X."

Note that a `tablist`'s orientation is not announced when using VoiceOver.


#### Android Accessibility Suite (TalkBack)
The `tab`s within the `tablist` will be part of the focusable elements when TalkBack navigation has been set to "controls".  Otherwise they are accessible by use of left and right swiping under the default navigation setting.

**Using Android Chrome:**
When focusing a `tab`, TalkBack will announce the accessible name of the `tab` followed by its role.  If the `tab` is active, TalkBack will announce "Selected" prior to the accessible name of the `tab`.

When a `tab` is activated, TalkBack makes no explicit announcement to the state change. 

For instance, when focusing the first `tab` which is selected:
>"Selected, Accessible Name, Tab. Double tap to activate."

and when moving focus to the second `tab`:
>"Accessible Name, Tab. Double tap to activate."

**Using Android Firefox:**
When focusing a `tab`, TalkBack will announce the accessible name of the `tab` followed by its role, then announce the current number out of the max number, and then announce its within a `tablist` (being within a `tablist` is only announced when focusing the first instance of a `tab` within the `tablist`).  If the `tab` is currently the selected `tab`, "selected" will be announced after the accessible name of the `tab`.

For instance, when focusing the first `tab` which is selected:
>"Accessible Name, Selected, Tab 1 of X. Tablist."

and when moving focus to the second `tab`:
>"Accessible Name, Tab 2 of X."


Note that a `tablist`'s orientation is not announced when using TalkBack with either Firefox or Chrome.


## Dependencies
There are no dependencies for this script. Any necessary polyfill (for IE11) is included in the JavaScript.


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
