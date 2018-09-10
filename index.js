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
    elSelector: '[data-atabs]',
    tablistSelector: '[data-atabs-list]',
    panelSelector: '[data-atabs-panel]',
    headingSelector: '[data-atabs-heading]',
    elClass: 'atabs',
    panelClass: 'atabs__panel',
    tabListClass: 'atabs__list',
    tabClass: 'atabs__list__tab',
    findTabs: true,
    defaultTabLabel: 'Tab ',
    orientation: 'horizontal'
  };

  /**
   *
   */
  var ARIAtabs = function ( inst, options ) {
    var el = inst;
    var elID;
    var tab;
    var tabList;
    var tabPanels;

    var acIDs = [];

    var tabs = [];
    var activeIndex = 0;

    var _options = Object.assign(ARIAtabsOptions, options);

    var init = function () {
      var self = this;
      el.id = el.id || util.generateID(_options.baseID);
      elID = el.id

      // find or create the tabList
      tabList = generateTablist();

      // find tabPanels
      tabPanels = doc.querySelectorAll('#' + elID + ' > ' + _options.panelSelector);

      tabTOC();
      setupPanels();
      generateTabs();

      tab = doc.querySelectorAll('#' + elID + ' > ' + '[role="tablist"] [role="tab"]');

      for ( var i = 0; i < tab.length; i++ ) {
        self.addTab(tab[i]);
      }
    };

    this.addTab = function ( newTab, idx ) {
      if ( idx ) {
        idx = idx - 1;
        tabs.splice(idx, 0, newTab);
      }
      else {
        tabs.push(newTab);
      }
    } // this.addTab()

    this.removeTab = function ( idx ) {
      tabs[idx].removeEventListener('click');
      tabs[idx].splice(idx, 1);
    }; // this.removeTab()


    var generateTablist = function ( tabList ) {
      var newTablist = el.querySelector(_options.tablistSelector) || doc.createElement('div');
      newTablist.setAttribute('role', 'tablist');
      newTablist.classList.add(_options.tabListClass);
      newTablist.id = elID + '_list';
      newTablist.innerText = '';
      el.insertBefore(newTablist, el.querySelector(':first-child'));

      tabList = doc.getElementById(newTablist.id);
      return tabList
    }; // generateTablist()


    var generateTabs = function () {
      var i;
      var newTab;

      for ( i = 0; i < tabPanels.length; i++ ) {
        var panelHeading = tabPanels[i].querySelector(_options.headingSelector);
        var panelLabel = tabPanels[i].hasAttribute('data-atabs-panel-label');

        newTab = doc.createElement('button');
        newTab.setAttribute('role', 'tab');
        newTab.setAttribute('aria-controls', acIDs[i]);
        newTab.classList.add(_options.tabClass);

        if ( activeIndex === i ) {
          newTab.setAttribute('aria-selected', 'true');
        }
        else {
          newTab.setAttribute('aria-selected', 'false');
          newTab.tabIndex = '-1';
        }


        if ( panelLabel ) {
          newTab.textContent = tabPanels[i].getAttribute('data-atabs-panel-label');
        }
        else if ( panelHeading.textContent !== '' ) {
          newTab.textContent = panelHeading.textContent;
        }
        else {
          newTab.textContent = _options.defaultTabLabel + (i + 1);
        }

        tabList.appendChild(newTab);
      }
    }; // generateTabs()


    var tabTOC = function () {
      if ( el.getAttribute('data-atabs-toc') ) {
        var toc = doc.getElementById(el.getAttribute('data-atabs-toc'));
        // safety check to make sure a toc isn't set to be deleted
        // after it's already deleted. e.g. if there are two
        // dat-atabs-toc that equal the same ID.
        if ( toc ) {
          toc.parentNode.removeChild(toc);
        }
      }
    };


    var setupPanels = function () {
      var i;

      for ( i = 0; i < tabPanels.length; i++ ) {
        tabPanels[i].id = tabPanels[i].id || elID + '_panel_' + i;
        acIDs.push(tabPanels[i].id);

        tabPanels[i].classList.add(_options.panelClass);
        tabPanels[i].hidden = true;

        if ( tabPanels[i].hasAttribute('data-atabs-default') ) {
          activeIndex = i;
        }
      }

      tabPanels[activeIndex].hidden = false;
    };






    var focusActiveTab = function () {
      tabs[activeIndex].focus();
    }; // focusActiveTab()



    init.call(this);

    return this;
  }; // ARIAtabs()

  w.ARIAtabs = ARIAtabs;
})( window, document );
