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

  generateID: function ( base ) {
    return base + Math.floor(Math.random() * 999);
  }
};

(function ( w, doc, undefined ) {
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
    defaultTabLabel: 'Tab ',
    elClass: 'atabs',
    customTabClassAttribute: 'data-atabs-tab-class',
    tabLabelAttribute: 'data-atabs-tab-label',
    headingAttribute: 'data-atabs-heading',
    defaultOrientation: 'horizontal',
    orientationAttribute: 'data-atabs-orientation',
    panelClass: 'atabs__panel',
    panelSelector: '[data-atabs-panel]',
    tabClass: 'atabs__list__tab',
    tabListClass: 'atabs__list',
    tablistSelector: '[data-atabs-list]',
    manual: true
  };

  var ARIAtabs = function ( inst, options ) {
    var _options = Object.assign(ARIAtabsOptions, options);
    var orientation = _options.defaultOrientation;
    var _tabListContainer;
    var _tabs = [];
    var activeIndex = 0;
    var defaultPanel = 0;
    var el = inst;
    var elID;
    var headingSelector = '[' + _options.headingAttribute + ']';

    var init = function () {
      elID = el.id || util.generateID(_options.baseID);

      if ( el.getAttribute(_options.orientationAttribute) === 'vertical' ) {
        orientation = 'vertical';
      }

      el.classList.add(_options.elClass);

      // find or create the tabList
      _tabListContainer = generateTablistContainer();

      // create the tabs and setup the panels
      buildTabs.call( this );

      // If there's a table of contents for no-js sections,
      // that won't be needed anymore. Remove it.
      deleteTOC();

      if ( activeIndex > -1 ) {
        activateTab();
      }
    };


    var generateTablistContainer = function () {
      var tabListContainer = el.querySelector(_options.tablistSelector) || doc.createElement('div');
      tabListContainer.setAttribute('role', 'tablist');
      tabListContainer.classList.add(_options.tabListClass);
      tabListContainer.id = elID + '_list';
      tabListContainer.innerHTML = ''; // clear out anything that shouldn't be there
      if ( orientation === 'vertical' ) {
        tabListContainer.setAttribute('aria-orientation', orientation);
      }
      el.insertBefore(tabListContainer, el.querySelector(':first-child'));

      return tabListContainer;
    }; // generateTablistContainer()


    this.addTab = function ( panel, label, customClass ) {
      var customClass = customClass || panel.getAttribute(_options.customTabClassAttribute);

      var generateTab = function ( index, id, tabPanel, customClass ) {
        var newTab = doc.createElement('button');
        newTab.id = elID + '_tab_' + index;
        newTab.tabIndex = -1;
        newTab.setAttribute('role', 'tab');
        newTab.setAttribute('aria-controls', id);
        newTab.setAttribute('aria-selected', activeIndex === index);
        newTab.innerHTML = tabPanel;
        newTab.classList.add(_options.tabClass);
        if ( customClass ) {
          newTab.classList.add(customClass);
        }

        newTab.addEventListener('click', function () {
          onClick.call( this, index );
          this.focus();
        }, false);

        newTab.addEventListener('keydown', onKeyPress.bind(this), false);
        return newTab;
      };

      var newPanel = panel;
      var i = _tabs.length;

      if ( !newPanel ) {
        return;
      }

      var panelHeading = newPanel.querySelector(headingSelector);
      var finalLabel = [
            label,
            newPanel.getAttribute(_options.tabLabelAttribute),
            panelHeading && panelHeading.textContent,
            _options.defaultTabLabel + (i + 1)
          ]
          .filter( function ( l ) {
            return l && l !== '';
          })[0];


      var newId = newPanel.id || elID + '_panel_' + i;
      var b = generateTab(i, newId, finalLabel, customClass);

      _tabListContainer.appendChild(b);
      newPanel.id = newId;
      newPanel.tabIndex = -1;
      newPanel.setAttribute('aria-labelledby', elID + '_tab_' + i)
      newPanel.classList.add(_options.panelClass);
      newPanel.hidden = true;

      if ( !el.contains(panel) ) {
        el.appendChild(panel);
      }

      if ( defaultPanel === 0 && newPanel.getAttribute('data-atabs-panel') === 'default' ) {
        activeIndex = i;
        defaultPanel = activeIndex;
      }

      if ( panelHeading ) {
        if ( panelHeading.getAttribute(_options.headingAttribute) !== 'keep' ) {
          panelHeading.parentNode.removeChild(panelHeading)
        }
      }

      _tabs.push({ tab: b, panel: newPanel });
    };


    var buildTabs = function () {
      var t;
      var tabs = el.querySelectorAll(':scope > ' + _options.panelSelector);

      for ( var i = 0; i < tabs.length; i++ ) {
        this.addTab(tabs[i]);
      }
    }; // buildTabs()


    var deleteTOC = function () {
      if ( el.getAttribute('data-atabs-toc') ) {
        var toc = doc.getElementById(el.getAttribute('data-atabs-toc'));
        // safety check to make sure a toc isn't set to be deleted
        // after it's already deleted. e.g. if there are two
        // dat-atabs-toc that equal the same ID.
        if ( toc ) {
          toc.parentNode.removeChild(toc);
        }
      }
    }; // deleteTOC()


    var incrementActiveIndex = function () {
      if ( activeIndex < _tabs.length - 1 ) {
        return ++activeIndex;
      }
      else {
        activeIndex = 0;
        return activeIndex;
      }
    }; // incrementActiveIndex()


    var decrementActiveIndex = function () {
      if ( activeIndex > 0 ) {
        return --activeIndex;
      }
      else {
        activeIndex = _tabs.length - 1;
        return activeIndex;
      }
    }; // decrementActiveIndex()


    var focusActiveTab = function () {
      _tabs[activeIndex].tab.focus();
    }; // focusActiveTab()


    var onClick = function ( index ) {
      activeIndex = index;
      activateTab();
    }; // onClick()


    var onKeyPress = function ( e ) {
      var keyCode = e.keyCode || e.which;

      switch (keyCode) {
        case util.keyCodes.SPACE:
          e.preventDefault();
          activateTab();
          break;

        case util.keyCodes.LEFT:
          if ( orientation === 'horizontal' ) {
            e.preventDefault();
            decrementActiveIndex();
            focusActiveTab();

            if ( _options.activate === 'automatic' ) {
              activateTab();
            }
          }
          break;

        case util.keyCodes.RIGHT:
          if ( orientation === 'horizontal' ) {
            e.preventDefault();
            incrementActiveIndex();
            focusActiveTab();
          }
          break;

        case util.keyCodes.UP:
          if ( orientation === 'vertical' ) {
            e.preventDefault();
            decrementActiveIndex();
            focusActiveTab();
          }
          break;

        case util.keyCodes.DOWN:
          if ( orientation === 'vertical' ) {
            e.preventDefault();
            incrementActiveIndex();
            focusActiveTab();
          }
          else {
            e.preventDefault();
            _tabs[activeIndex].panel.focus();
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

        // case util.keyCodes.DELETE:
        // case util.keyCodes.BACKSPACE:
          /*
            TODO
            break this out into its own function
           */
          // var getParent = e.target.parentNode;
          // var getPanel = e.target.getAttribute('aria-controls');
          // getParent.removeChild(e.target);
          // getParent.parentNode.removeChild(doc.getElementById(getPanel));

          // activateTab( (activeIndex - 1) );
          /**
           * if the active tab is the tab deleted, need to focus
           * the previous tab in the list.
           *
           * if the deleted tab is not the current activeIndex, then
           * set keyboard focus to the previous tab in the list.
           *
           * if there is only one tab left in the list, this function
           * should not run.
           */

          // break;

        default:
          break;
      }
    }; // onKeyPress()


    var deactivateTabs = function () {
      for ( var i = 0; i < _tabs.length; i++ ) {
        deactivateTab(i);
      }
    }; // deactivateTabs()


    var deactivateTab = function ( idx ) {
      _tabs[idx].panel.hidden = true;
      _tabs[idx].tab.tabIndex = -1;
      _tabs[idx].tab.setAttribute('aria-selected', false);
    };


    /**
     * Update the active Tab and make it focusable.
     * Deactivate any previously active Tab.
     * Reveal active Panel.
     */
    var activateTab = function ( idx ) {
      var active = _tabs[idx] || _tabs[activeIndex];
      deactivateTabs();
      active.tab.setAttribute('aria-selected', true);
      active.tab.tabIndex = 0;

      active.panel.hidden = false;
    }; // activateTab()

    init.call( this );

    return this;
  }; // ARIAtabs()

  w.ARIAtabs = ARIAtabs;
})( window, document );

