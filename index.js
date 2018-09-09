'use strict';

// add helper functions


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
    SPACE: 32
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
    baseID: 'atab',
    elSelector: '[data-atabs]',
    tablistSelector: '[data-atabs-list]',
    panelSelector: '[data-atabs-panel]',
    tabSelector: '[data-atabs-tab]',
    elClass: 'atabs',
    panelClass: 'atabs__panel',
    tabListClass: 'atabs__list',
    tabClass: 'atabs__list__tab',
    findTabs: true
  };

  /**
   *
   */
  var ARIAtabs = function ( inst, options ) {
    var el = inst;
    var elID;
    var tab;
    var tabList;
    var tabPanel;

    var tabs = [];
    var activeIndex = 0;

    var _options = Object.assign(ARIAtabsOptions, options);

    var init = function () {
      var self = this;
      elID = el.id || util.generateID(_options.baseID);

      // find or create the tabList
      tabList = el.querySelector('[role="tablist"]') || generateTablist();
      tabList.classList.add(_options.tabListClass);

      // find tabPanels
      tabPanel = el.querySelectorAll(_options.panelSelector);

      //
      setupPanels();
    };

    this.addTab = function ( newTab, idx ) {
      if ( idx ) {
        idx = idx - 1;
        tabs.splice(idx, 0, newTab);
      }
      else {
        tabs.push(newTab);
      }
      // add events here
    } // this.addTab()

    this.removeTab = function ( idx ) {
      tabs[idx].removeEventListener('click');
      tabs[idx].splice(idx, 1);
    }; // this.removeTab()

    var generateTablist = function ( tabList ) {
      var newTablist = el.querySelector(_options.tablistSelector) || doc.createElement('div');
      newTablist.setAttribute('role', 'tablist');
      el.insertBefore(newTablist, el.querySelector(':first-child'));

      tabList = newTablist
      return tabList
    }; // generateTablist()

    var generateTabs = function () {

    }; // generateTabs()

    var tabHeadings = function () {

    }; // tabHeadings()

    var tabTOC = function () {

    };


    var populateTablist = function () {

    };



    var setupTablist = function () {

    }; // setupTablist()


    var setupPanels = function () {

    }; // setupPanels()

    // tabs have a single focus stop

    var focusActiveTab = function () {
      tabs[activeIndex].focus();
    }; // focusActiveTab()


    var attachEvents = function () {
    }; // attachEvents()

    init.call(this);

    return this;
  }; // ARIAtabs()

  w.ARIAtabs = ARIAtabs;
})( window, document );
