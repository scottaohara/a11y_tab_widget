;(function ( $, w, doc ) {

  'use strict';

  var a11yTabs = {};

  a11yTabs.NS = "a11yTabs";
  a11yTabs.AUTHOR = "Scott O'Hara";
  a11yTabs.VERION = "1.0.2";
  a11yTabs.LICENSE = "https://github.com/scottaohara/accessible-components/blob/master/LICENSE.md";

  // define the plug-in
  $.fn.extend({

    a11yTabs: function ( e ) {

      $('html').removeClass('no-js');

      // setup global class variables
      var tabWidget           = '[data-action="a11y-tabs"]',
          tabList             = '.js-tabs__list',
          tabBtn              = '.js-tabs__list__item',
          tabPanelContainer   = '.js-tabs-panel-container',
          tabPanel            = '.js-tabs__panel',
          tabDefault          = '.js-show-by-default';

      return this.each( function () {

        // $(tabList).replaceWith(function () {
        //   return $('<ul/>', {
        //     class: 'tab-list js-tabs__list clearfix',
        //     html: this.innerHTML
        //   });
        // });


        // set up variables specific to the each instance
        var id = this.id,
            $this = $(this),
            $self = $('#' + id),

        /*
          Setup Tab List & tabs
        */
        tabsSetup = function () {
          var $tabItems = $(tabList + ' li'),
              $tabBtns = $self.find(tabBtn);


          // if there's a pre-set aria-hidden on the tab list,
          // then make sure it's set to false.  If not, then
          // never mind.
          if ( $self.find(tabList).attr('aria-hidden') ) {
            $self.find(tabList).attr('aria-hidden', 'false');
          }


          // set up the appropriate aria-role for the tablist, and
          // give it a unique ID based on the a11y tabs component ID
          $self.find(tabList).attr({
            'role': 'tablist',
            'id': id + '_tablist'
          });


          // set the <li>s within the tab menu to have a role
          // of presentation, to cut down on the verbose
          // audio declarations of list elements when using
          // voice over
          $self.find($tabItems).attr({
            'role': 'presentation'
          });


          // for each tab item (link/button) within this tab menu,
          // take the href and use it to apply the appropriate
          // aria-attributes
          // set aria-selected
          $tabBtns.each( function () {
            var $this = $(this),
                $getID = $this.attr('href').substring(1);

            $this.attr({
              'aria-controls': $getID,
              'id': $getID + '_tab',
              'aria-selected': 'false',
              'tabindex': '-1',
              'role': 'tab'
            });
          });

          // Normally the first item in a tab list should be activated
          // and its panel displayed.  js-show-by-default is how this is
          if ( $self.find(tabDefault).length === 0) {
            $self.find(tabList + ' li').first().children().addClass('js-show-by-default');
          }

          // update the default tab with the appropriate attribute values
          $(tabDefault).attr({
            'aria-selected': 'true',
            'tabindex': '0'
          });

        },




        panelsSetup = function () {

          // give the tab panel container a unique ID based off the
          // main ID of the a11y tabs component.
          $self.find(tabPanelContainer).attr({
            'id': id + '_tpc'
          });


          // find all the panels
          $(tabPanel).each( function () {
            var $this = $(this);

            // set their attributes
            $this.attr({
              'aria-labelledby': $this.attr('id')+'_tab',
              'aria-hidden': 'true',
              'role': 'tabpanel'
            });

            // check to make sure the correct panel is shown by default,
            // which is determined by the tab with the js-show-by-default class
            if ( $( '#'+ $this.attr('id')+'_tab' ).hasClass('js-show-by-default') ) {
              $this.attr('aria-hidden', 'false');
            }

          });
        },



        tabsShow = function ( e ) {

          var $targetTab = $(this).find( e.target ),
              $targetTabMenu = $targetTab.closest(tabList),
              $otherBtns = $targetTabMenu.find(tabBtn),
              $targetPanel = $('#' + $targetTab.attr('aria-controls') );

          // hide the tabs again
          $otherBtns.attr({
            'aria-selected': 'false',
            'tabindex': '-1'
          }).removeAttr('aria-live').removeClass('js-show-by-default');

          // activate the selected
          $targetTab.attr({
            'aria-selected': 'true',
            'tabindex': '0',
            'aria-live': 'polite'
          });

          // reset panels to hidden
          $targetPanel.parent().children().attr('aria-hidden', 'true');
          $targetPanel.attr('aria-hidden', 'false');
          $targetPanel.children().focus();

          e.preventDefault();
        },



        // make sure tabs function as expected by keyboard users
        // this makes sure that navigating through tabs is set to act
        // like navigating through radio buttons with a keyboard,
        // as a keyboard user should not have to keyboard tab through
        // undesired navigation tabs to get to content
        tabBtnKeytrolls = function ( e ) {

          var $currentTabItem = $(e.target).parent(),

          // next and previous tabs dynamically set and accessible
          // by right/down, left/up keys

          // TODO:
          // this doesn't circle around to the beginning/end like it's supposed
          // to when the current focus is the first/last element in the tablist
          // why?
              $tabPrev = $currentTabItem.prev() ?
                         $currentTabItem.prev().children().eq(0) :
                         $currentTabItem.last().children().eq(0),

              $tabNext =  $currentTabItem.next() ?
                          $currentTabItem.next().children().eq(0) :
                          $currentTabItem.first().children().eq(0);


          switch ( e.keyCode ) {
            case 39: // right
            case 40: // down
              $tabNext.focus();
              break;

            case 37: // left
            case 38: // up
              $tabPrev.focus();
              break;

            case 32: // space bar
              e.preventDefault();
              tabsShow.bind(this);
              break;

            default:
              break;
          }
        },


        tabPanelKeytrolls = function ( e ) {

          var $currentPanel = $(e.target).closest(tabPanelContainer),
              $currentPanelID = $currentPanel.attr('id'),
              $currentTabListID = $currentPanelID.substring(0, $currentPanelID.length - 4) + '_tablist',
              $currentTabList = $('#'+$currentTabListID),
              $currentTab = $currentTabList.find('.js-tabs__list__item[aria-selected="true"]'),

              $firstTab = $currentTabList.find('li').first().children(),
              $lastTab = $currentTabList.find('li').last().children(),

              $prevTab,
              $nextTab;


          // determine what next/prev are
          if ( $currentTab.parent().is(':first-child') ) {
            $prevTab = $lastTab;
            $nextTab = $currentTab.parent().next().children();
          }
          else if ( $currentTab.parent().is(':last-child') ) {
            $prevTab = $currentTab.parent().prev().children();
            $nextTab = $firstTab;
          }
          else {
            $prevTab = $currentTab.parent().prev().children();
            $nextTab = $currentTab.parent().next().children();
          }


          if ( e.ctrlKey ) {
            e.preventDefault(); // prevent default behavior

            switch ( e.keyCode ) {
              case 38: // up
                $prevTab.focus();
                break;

              case 40: // down
                $nextTab.focus();
                break;

              case 33: // pg up
                setTimeout(function () {
                  $prevTab.focus().click();
                }, 10);

                break;

              case 34: // pg down

                setTimeout(function () {
                  $nextTab.focus().click();
                }, 10);
                break;

              default:
                break;
            }
          }
        };

        // run setups on load
        tabsSetup();
        panelsSetup();

        // Events
        $self.find(tabBtn).on( 'click', tabsShow.bind(this) );
        $self.find(tabBtn).on( 'keydown', tabBtnKeytrolls.bind(this) );
        $self.find(tabPanel).on( 'keydown', tabPanelKeytrolls.bind(this) );

      }); // end: return this.each()

    } // end a11yTabs function

  }); // end $.fn.extend

  // call it bro
  $('[data-action="a11y-tabs"]').a11yTabs();

})( jQuery, this, this.document );



/*

  Expected Mark-up

<!--

  .tab-container is here for styling purposes / to group the
  tab components together. It is actually not required by the JS,
  as the tab menu and it's corresponding panels can exist in different
  locations on a page.

-->
<section class="tab-container">

  <!--

    the main tab list MUST have:
      [id]
      [aria-hidden="true"]
      [class="js-tabs__list"]

    Each link within the tab list must have a unique href,
    setup as '#uniqueNameHere' which can not match any other IDs
    on the page. The links must also have a class of "js-tabs__list__item"

  -->
  <ul class="tab-menu js-tabs__list clearfix" aria-hidden="true" id="uniqueID">
    <li>
      <a href="#panelA"
         class="tab-menu__item js-tabs__list__item">
         Common Filters
      </a>
    </li>
    <li>
      <a href="#panelB"
         class="tab-menu__item js-tabs__list__item js-show-by-default">
         Search for Concepts
      </a>
    </li>
  </ul>


  <!--

    Tab panels must be contained within a tab-panel-container
    parent element.

    Tab panels more than likely should be <section> elements.
    <article> and <fieldset> elements would also be acceptable
    semantic wrappers of tab panel content.

    Each tab panel must have
    • an [id] with the same value of the tab menu
      href that acts as it's trigger.
    • a class of js-tabs__panel

  -->
  <div class="tab-panel-container">
    <section id="panelA"
             class="tab-panel js-tabs__panel">
      main content section 1
    </section>
    <section id="panelB"
             class="tab-panel js-tabs__panel">
      two
    </section>
  </div>

</section> <!-- end .tab-container -->

*/
