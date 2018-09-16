'use strict';

// add utilities
var util = {
  keyCodes: {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    HOME: 36,
    END: 35,
    ENTER: 13,
    SPACE: 32,
    BACKSPACE: 46,
    DELETE: 8
  },

  generateID: function(base) {
    return base + Math.floor(Math.random() * 999);
  }
};

(function(w, doc, undefined) {
  /**
   * ARIA Tabbed Interface
   * Creates a tab list to toggle the visibility of
   * different subsections of a document.
   *
   * Author: Scott O'Hara
   * Version: x
   * License:
   */
  var ARIAtabsOptions = {
    baseID: 'atab_',
    tablistSelector: '[data-atabs-list]',
    panelSelector: '[data-atabs-panel]',
    headingSelector: '[data-atabs-label]',
    elClass: 'atabs',
    panelClass: 'atabs__panel',
    tabListClass: 'atabs__list',
    tabClass: 'atabs__list__tab',
    findTabs: true,
    defaultTabLabel: 'Tab ',
    orientation: 'horizontal',
    manual: true
  };

  /**
   *
   */
  var ARIAtabs = function(inst, options) {
    var _options = Object.assign(ARIAtabsOptions, options);
    var _tabListContainer;
    var _tabs = [];
    var activeIndex = 0;
    var el = inst;
    var elID;
    var oldIndex = -1;
    var tabs = [];

    var init = function () {
      el.id = el.id || util.generateID(_options.baseID);
      elID = el.id;

      // find or create the tabList
      _tabListContainer = generateTablistContainer();

      buildTabs.call(this);

      // If there's a table of contents for no-js sections,
      // that won't be needed anymore. Remove it.
      deleteTOC();

      if (activeIndex > -1) {
        activateTab();
      }
    };

    var generateTablistContainer = function() {
      var tabListContainer = el.querySelector(_options.tablistSelector) || doc.createElement('div');
      tabListContainer.setAttribute('role', 'tablist');
      tabListContainer.classList.add(_options.tabListClass);
      tabListContainer.id = elID + '_list';
      tabListContainer.innerHTML = '';
      el.insertBefore(tabListContainer, el.querySelector(':first-child'));

      return tabListContainer;
    }; // generateTablistContainer()

    this.addTab = function( content, label ) {
      var generateButton = function( index, id, tabContent ) {
        var t = doc.createElement('button');
        t.id = elID + '_tab_' + index;
        t.tabIndex = -1;
        t.setAttribute('role', 'tab');
        t.setAttribute('aria-controls', id);
        t.setAttribute('aria-selected', activeIndex === index);
        t.classList.add(_options.tabClass);
        t.innerHTML = tabContent;

        t.addEventListener('click', function() {
          onClick.call( this, index );
          this.focus();
        }, false);

        t.addEventListener('keydown', onKeyPress.bind(this), false);
        return t;
      };

      var c = content;
      var i = _tabs.length;

      if ( !c ) {
        return;
      }

      // TODO: Write a comment;
      var finalLabel = [
            label,
            c.getAttribute('data-atabs-panel-label'),
            c.querySelector(_options.headingSelector) && c.querySelector(_options.headingSelector).textContent,
            _options.defaultTabLabel + (i + 1)
          ]
          .filter(function(l) {
            return l && l !== '';
          })[0];

      var newId = c.id || elID + '_panel_' + i;
      var b = generateButton(i, newId, finalLabel);

      _tabListContainer.appendChild(b);
      c.id = newId;
      c.tabIndex = 0;
      c.setAttribute('aria-labelledby', elID + '_tab_' + i)
      c.classList.add(_options.panelClass);
      c.hidden = true;

      if ( !el.contains(content) ) {
        el.appendChild(content);
      }

      if (c.hasAttribute('data-atabs-default') ) {
        activeIndex = i;
      }

      _tabs.push({ button: b, content: c });
    };

    var buildTabs = function() {
      var t, i = 0;
      var tabs = el.querySelectorAll(':scope > ' + _options.panelSelector);

      for (; i < tabs.length; i++) {
        this.addTab(tabs[i]);
      }
    };

    var deleteTOC = function() {
      if (el.getAttribute('data-atabs-toc')) {
        var toc = doc.getElementById(el.getAttribute('data-atabs-toc'));
        // safety check to make sure a toc isn't set to be deleted
        // after it's already deleted. e.g. if there are two
        // dat-atabs-toc that equal the same ID.
        if (toc) {
          toc.parentNode.removeChild(toc);
        }
      }
    }; // deleteTOC()

    var incrementActiveIndex = function() {
      if (activeIndex < _tabs.length - 1) {
        return ++activeIndex;
      } else {
        activeIndex = 0;
        return activeIndex;
      }
    }; // incrementActiveIndex()

    var decrementActiveIndex = function() {
      if (activeIndex > 0) {
        return --activeIndex;
      } else {
        activeIndex = _tabs.length - 1;
        return activeIndex;
      }
    }; // decrementActiveIndex()

    var focusActiveTab = function() {
      _tabs[activeIndex].button.tabIndex = 0;
      _tabs[activeIndex].button.focus();
    }; // focusActiveTab()

    var onClick = function(index) {
      activeIndex = index;
      activateTab();
    };

    var onKeyPress = function(e) {
      var keyCode = e.keyCode || e.which;

      switch (keyCode) {
        case util.keyCodes.SPACE:
          e.preventDefault();
          e.target.click();
          break;

        case util.keyCodes.LEFT:
          if (_options.orientation === 'horizontal') {
            e.preventDefault();
            decrementActiveIndex();
            focusActiveTab();
            if (_options.activate === 'automatic') {
              activateTab();
            }
          }
          break;

        case util.keyCodes.RIGHT:
          if (_options.orientation === 'horizontal') {
            e.preventDefault();
            incrementActiveIndex();
            focusActiveTab();
          }
          break;

        case util.keyCodes.UP:
          if (_options.orientation === 'vertical') {
            e.preventDefault();
            decrementActiveIndex();
            focusActiveTab();
          }
          break;

        case util.keyCodes.DOWN:
          if (_options.orientation === 'vertical') {
            e.preventDefault();
            incrementActiveIndex();
            focusActiveTab();
          }
          break;

        case util.keyCodes.END:
          e.preventDefault();
          activeIndex = _tabs.length - 1;
          focusActiveTab();
          break;

        case util.keyCodes.HOME:
          e.preventDefault();
          activeIndex = 0;
          focusActiveTab();
          break;

        case util.keyCodes.DELETE:
        case util.keyCodes.BACKSPACE:
          var getParent = e.target.parentNode;
          var getPanel = e.target.getAttribute('aria-controls');
          getParent.removeChild(e.target);
          getParent.parentNode.removeChild(doc.getElementById(getPanel));
          /**
           * this should be coupled with the removeTab
           * function.
           */

          break;

        default:
          break;
      }
    }; // onKeyPress()

    var deactivateTabs = function() {
      _tabs.forEach(function(t, i) {
        deactivateTab(i);
      });
    };

    var deactivateTab = function(idx) {
      _tabs[idx].content.hidden = true;
      _tabs[idx].button.tabIndex = -1;
      _tabs[idx].button.setAttribute('aria-selected', false);
    };

    var activateTab = function(e) {
      var active = _tabs[activeIndex];
      deactivateTabs();
      active.content.hidden = false;
      active.button.setAttribute('aria-selected', true);
      active.button.tabIndex = 0;
    }; // activateTab()

    init.call(this);

    return this;
  }; // ARIAtabs()

  w.ARIAtabs = ARIAtabs;
})(window, document);

