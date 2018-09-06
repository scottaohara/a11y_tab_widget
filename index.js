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
   * Author: Scott O'Hara
   * Version: x
   * License:
   */
  var ARIAtabsOptions = {
  	baseID: 'atab_',
  	elSelector: '[data-atab]',
  	panelSelector: '[data-atabs-panel]',
    tabSelector: '[data-atabs-tab]',
  	elClass: 'atab',
  	panelClass: 'atab__panel',
  	tabListClass: 'atab__list',
  	tabClass: 'atab__list__tab',
    findTabs: true
  };

  /**
   *
   */
  var ARIAtabs = function ( inst, options ) {
  	var el = inst;
  	var elID;
  	var tabs = [];
  	var activeIndex = 0;

  	var _options = Object.assign(ARIAtabsOptions, options);

  	var init = function () {
  		var self = this;
  	};



	  var focusActiveTab = function () {
	  	tabs[activeIndex].focus();
	  }; // focusActiveTab()


	  var attachEvents = function () {
      //
	  }; // attachEvents()

	  init.call(this);

	  return this;
  }; // ARIAtabs()

  w.ARIAtabs = ARIAtabs;
})( window, document );



/**
 * Requirements
 */

